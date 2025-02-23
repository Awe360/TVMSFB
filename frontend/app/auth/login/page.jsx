"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "@/app/components/Input";
import { useAuthStore } from "@/app/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess, setUser } from "@/app/redux/authSlice";
import axios from "axios";
axios.defaults.withCredentials = true;
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router=useRouter();
  // const { login, isLoading, error,isAuthenticated } = useAuthStore();
const dispatch = useDispatch();
const {user,isLoading,error}=useSelector((state)=>state.auth)
useEffect(() => {
  console.log("User State Updated:", user);
}, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart())
    
   try {
    
    const response=await axios.post("https://tvmsfb.onrender.com/api/admin/login", { email, password });
    
    dispatch(loginSuccess(response?.data?.user))
    console.log("user",user)
    router.push("admin/home");

   } catch (error) {
    console.log(error)
    dispatch(loginFailure(error?.response?.data?.message || "Something went wrong"))
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
            Welcome Back
          </motion.h2>

          <form onSubmit={handleLogin}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-center mt-6"
            >
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-500 hover:underline mx-auto"
              >
                Forgot password?
              </Link>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-red-500 font-semibold mt-4 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
              type="submit"
              disabled={isLoading}
              
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>


      </motion.div>
    </div>
  );
};

export default LoginPage;
