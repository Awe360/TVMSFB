
import AdminModel from "../model/AdminModel.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendWelcomeEmail,
} from "../sendGride/emails.js"; 

export const ValidateAdmin=async(req,res)=>{
    try {
      const adminID = req.body.deviceId;
      const adminExists = await AdminModel.findOne({ID:adminID});
      if (adminExists) {
        return res.json({ autherized: true });
      } else {
        return res.json({ autherized: false });
      }
    } catch (error) {
      console.error("Error validating ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const RegisterAdmin=async (req, res) => {
    try {
      const { name, ID, email, password } = req.body;
      const tempPassword=password
  console.log(req.body);
      const existingAdmin = await AdminModel.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
  
      const newAdmin = new AdminModel({
        name,
        ID,
        email,
        password: hashedPassword,
        role: "admin",
      });
  
      await newAdmin.save();
      await sendWelcomeEmail({email:email,name:name,ID:ID,tempPassword,loginUrl:'http://localhost:3000'});
      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering admin", error });
    }
  };
  export const GetAllTVs = async (req, res) => {
    try {
      const tvs = await NewTVModel.find();
      res.status(200).json(tvs);
    } catch (error) {
      res.status(500).json({ message: "Server error!" });
    }
  };
  export const GetAllAdmin = async (req, res) => {
    try {
      const admins = await AdminModel.find();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: "Server error!" });
    }
  };
  export const DeleteAdmin = async (req, res) => {
    try {
      const { userId } = req.body;
  
      const adminToRemove = await AdminModel.findOne({ ID: userId });
  
      if (!adminToRemove) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
  
      
      await AdminModel.findByIdAndDelete(adminToRemove._id);
  
      const admins = await AdminModel.find();
  
      res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
        users: admins.map(({ _doc, password, ...rest }) => rest), // Exclude passwords
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error!", error });
    }
  };
  export const BlockAdmin=async(req, res)=>{
    try {
      const { userId } = req.body;
  
      const admin = await AdminModel.findOne({ ID: userId });
  
      if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
      else if(admin.role==="SuperAdmin"){
        return res.status(404).json({ success: false, message: "Super Admin cannot be blocked" });
      }
  
      admin.status = admin.status === "Blocked" ? "Unblocked" : "Blocked";
      await admin.save();
      const admins = await AdminModel.find();
  
      res.status(200).json({
        success: true,
        message: "Admin status updated successfully",
        admin,
        users: admins.map(({ _doc, password, ...rest }) => rest),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error!", error });
    }

  };
  export const UnblockAdmin=async(req,res)=>{
    const {userId}=req.body;
    console.log("user Id",userId);
    try {
      const admin = await AdminModel.findOne({ ID: userId });
  
      if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

  
      admin.status = "Unblocked";
      await admin.save();
      const admins = await AdminModel.find();
  
      res.status(200).json({
        success: true,
        message: "Admin status updated successfully",
        admin,
        users: admins.map(({ _doc, password, ...rest }) => rest),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error!", error });

  }
  };
  
  
  export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await AdminModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
      if (user.status === "Blocked") {
        return res.status(400).json({ success: false,status:"Blocked", message: "Account is blocked,please contact the owner of the system " });
      }
  
      generateTokenAndSetCookie(res, user._id);
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log("Error in login ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  export const Logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  };
  
  export const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
      const user = await AdminModel.findOne({ email });
  console.log("email",user.email)
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
      console.log(user.status)
      if (user.status === "Blocked") {
        return res.status(400).json({ success: false, message: "Account is blocked,please contact the owner of the system " });
      }
  
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
  
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
  
      await user.save();
  
      await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
  
      res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
      console.log("Error in forgotPassword ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  export const ResetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      console.log("token",token)
      const { password } = req.body;
  
      const user = await AdminModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }
  
      // update password
      const hashedPassword = await bcryptjs.hash(password, 10);
  
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
  
      await sendResetSuccessEmail(user.email);
  
      res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
      console.log("Error in resetPassword ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  export const  CheckAuth = async (req, res) => {
    try {
      const user = await AdminModel.findById(req.userId).select("-password");
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.log("Error in checkAuth ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  export const SaveProfile=async(req,res)=>{
    const {userId,name,email}=req.body;
    console.log("payload",req.body);
    try {
     
      const user = await AdminModel.findByIdAndUpdate(userId, { name, email }, { new: true });
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
      generateTokenAndSetCookie(res, user._id);
      await user.save();
      res.status(200).json({ success: true, user });
      
    } catch (error) {
      console.log("Error in saveProfile ", error);
      res.status(400).json({ success: false, message: error.message });
      
    }
    
  }
  export const ChangePassword=async(req,res)=>{
    const {userId,currentPassword,newPassword}=req.body;
    try {
      const user = await AdminModel.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
      const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid current password" });
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.log("Error in changePassword ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  export const UpdatePhoto=async(req,res)=>{
    const {userId,profileImage}=req.body;
    try {
      const user = await AdminModel.findByIdAndUpdate(userId, { profileImage }, { new: true });
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      } 
      res.status(200).json({ success: true, user });
      
    } catch (error) {
      console.log("Error in updatePhoto ", error);
      res.status(400).json({ success: false, message: error.message });
      
    }

  }
  