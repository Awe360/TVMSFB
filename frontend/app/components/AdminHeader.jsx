'use client'

import React, { useState } from 'react';
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import axios from 'axios';


const AdminHeader = () => {
    const dispatch = useDispatch();
    const{user}=useSelector((state)=>state.auth)
    const router=useRouter()
  
    const handleProfileClick = () => {
        router.push('/admin/profile')
        
      };
      const handleLogOut=async() => {
        try {
          
        localStorage.removeItem("user");
        // // Clear persisted Redux state
        // await purgeStoredState(persistConfig);
        const response=await axios.post('https://tvmsb.onrender.com/api/admin/logout');
        dispatch(logout());
        router.push('/auth/login')
        } catch (error) {
          console.log(error?.response?.message)
        }
        
       
      }
  return (
    <div className='bg-gradient-to-r from-blue-600 to-purple-600 h-20 flex items-center justify-between '>
      <h1 className='text-white text-3xl font-bold animate-bounce hover:animate-pulse ml-10'>
        Welcome to TV Management System
      </h1>
      <div className="mr-5 ">
      
            <div className="relative md:py-0 py-2 text-center group">
              <div className="text-white text-xl flex items-center gap-1 hover:cursor-pointer justify-center">
                <IoPersonCircleSharp size={30} className='hover:cursor-pointer' />
                {user?.name}
                <FaCaretDown size={20} className='hover:cursor-pointer ml-1' />
              </div>
              <div className="absolute right-0 w-32 bg-blue-600 shadow-lg rounded-md py-2 z-10 hidden group-hover:block">
                <div onClick={handleProfileClick} className="block px-4 py-2 text-white hover:bg-yellow-300 cursor-pointer">
                  Profile
                </div>
                <button onClick={handleLogOut} className="block py-2 text-white hover:bg-yellow-300 w-full text-center">
                  Logout
                </button>
              </div>
            </div>
            </div>
          
    </div>
  );
};

export default AdminHeader;