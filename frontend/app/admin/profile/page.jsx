"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { getUserIdFromToken } from "@/app/utils/getIdfromCookie";
import { useAuthStore } from "@/app/store/authStore";
import {
  Loader,
  Camera,
  Upload,
  Edit,
  Save,
  Lock,
  User,
  Mail,
} from "lucide-react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, setUser } from "@/app/redux/authSlice";
import { toast } from "react-toastify";
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name);
  const [userId, setUserId] = useState(user?._id);
  const [email, setEmail] = useState(user?.email);
  const [role] = useState(user?.role);
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = async () => {
    if (!name || !email) {
      toast.warn("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post(
        "https://tvmsfb.onrender.com/api/admin/profile/save-profile",
        { userId, email, name }
      );
      dispatch(setUser(response.data.user));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.warn("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post(
        "https://tvmsfb.onrender.com/api/admin/profile/change-password",
        { userId, email, currentPassword, newPassword }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordFields(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react-upload");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dtinrmkcf/upload",
        formData,
       { withCredentials: false
        }
      );
      console.log("cloudinary response", response?.data);
      setProfileImage(response.data.secure_url);
      await saveProfileImage(response.data.secure_url);
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const saveProfileImage = async (imageUrl) => {
    try {
      const response = await axios.post(
        "https://tvmsfb.onrender.com/api/admin/profile/update-photo",
        {
          userId,
          profileImage: imageUrl,
        }
      );
      dispatch(setUser(response.data.user));
      toast.success("Profile image updated successfully");
    } catch (error) {
      toast.error("Failed to save image!");
    }
  };

  // if (isCheckingAuth) return <Loader className="animate-spin mx-auto my-20" />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-10 flex justify-center items-center">
      <Head>
        <title>Profile - TV Management System</title>
      </Head>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-around">
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={profileImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-white shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
              {uploading ? (
                <Loader className="animate-spin text-white w-6 h-6" />
              ) : (
                <Camera className="text-white w-6 h-6" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-blue-200">{user?.role}</p>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <User className="mr-2" /> Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{user?.name}</p>
              )}
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 text-gray-900">{user?.email}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            {isEditing ? (
              <div className="flex gap-4">
                <motion.button
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.05 }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <Save className="mr-2" /> Save Profile
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsEditing(false); // Exit editing mode
                    setName(user?.name); // Reset name to original value
                    setEmail(user?.email); // Reset email to original value
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center"
              >
                <Edit className="mr-2" /> Edit Profile
              </motion.button>
            )}
          </div>
        </div>
        <div className="p-6 border-t">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="mr-2" /> Change Password
          </h2>
          <motion.button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            whileHover={{ scale: 1.05 }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center"
          >
            <Lock className="mr-2" /> Change Password
          </motion.button>
          {showPasswordFields && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 mt-4"
            >
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              />
              <div className="flex gap-4">
                <motion.button
                  onClick={handleChangePassword}
                  whileHover={{ scale: 1.05 }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <Save className="mr-2" /> Submit
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowPasswordFields(false); // Hide password fields
                    setCurrentPassword(""); // Reset current password
                    setNewPassword(""); // Reset new password
                    setConfirmPassword(""); // Reset confirm password
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
