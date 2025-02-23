'use client'

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "lucide-react";

const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    ID: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
console.log(adminData);
    try {
      const res = await axios.post("https://tvmsfb.onrender.com/api/admin/register", adminData);
      
      toast.success(res.data.message);
      setAdminData({ name: "", ID: "", email: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleChange}
            placeholder="Admin Name"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />

          <input
            type="text"
            name="ID"
            value={adminData.ID}
            onChange={handleChange}
            placeholder="Admin ID"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />

          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? <Loader className='w-6 h-6 animate-spin  mx-auto' />  : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
