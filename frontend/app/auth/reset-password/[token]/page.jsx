"use client";

import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/app/store/authStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import Input from "@/app/components/Input";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordStart, resetPasswordSuccess,resetPasswordFailure } from "@/app/redux/authSlice";
import axios from "axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const{isLoading,error}=useSelector((state)=>state.auth)
  const[message,setMessage]=useState(null)
  // const { resetPassword, error, isLoading, message } = useAuthStore();
const dispatch=useDispatch()
  const router = useRouter();
  const {token} = useParams(); 
  console.log("token",token)
  useEffect(() => {
    console.log("Token:", token);
}, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      // await resetPassword(token, password);
      dispatch(resetPasswordStart());
      const response = await axios.post(`https://tvmsfb.onrender.com/api/admin/reset-password/${token}`, {
        password,
      });
      dispatch(resetPasswordSuccess());
      setMessage(response.data.message);
      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {

     dispatch(resetPasswordFailure(error.response.message ||"Error resetting password"))
      toast.error(error );
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
            Reset Password
          </motion.h2>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.p>
          )}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-green-500 text-sm mb-4 text-center"
            >
              {message}
            </motion.p>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Input
                icon={Lock}
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6"
            >
              <Input
                icon={Lock}
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
