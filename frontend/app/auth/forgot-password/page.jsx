"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import Input from "@/app/components/Input";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordFailure, forgotPasswordStart, forgotPasswordSuccess } from "@/app/redux/authSlice";
import axios from "axios";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
 const {isLoading,error}=useSelector((state)=>state.auth)
const dispatch=useDispatch()
  // const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     dispatch(forgotPasswordStart()) 
    const response = await axios.post(`https://tvmsfb.onrender.com/api/admin/forgot-password`, { email });
    dispatch(forgotPasswordSuccess());
    setIsSubmitted(true);
  } catch (error) {
    dispatch(forgotPasswordFailure(error?.response?.data?.message || "Network error"))
      
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-opacity-10 border-white"
      >
        <div className="p-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent"
          >
            Forgot Password
          </motion.h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6 text-center text-gray-600"
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                type="submit"
              >
                {isLoading ? (
                  <Loader className="size-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600">
                If an account exists for{" "}
                <span className="font-semibold">{email}</span>, you will receive
                a password reset link shortly.
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="px-8 py-6 bg-gray-50 bg-opacity-50 flex justify-center"
        >
          <Link
            href="/auth/login"
            className="text-blue-500 font-semibold text-sm hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
