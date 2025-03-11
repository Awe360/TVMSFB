"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";


export default function RegisterTV() {
  const [formData, setFormData] = useState({
    tvId: "",
    tvModel: "",
    tvSize: "",
    location: "",
    channelID: "announcement",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://tvmstd.onrender.com/api/tv/register-tv", formData);

      toast.success("TV registered successfully!");
      router.push("/admin/fetchAllTV"); 
      setFormData({ tvId: "", tvModel: "", tvSize: "", location: "", channelID: "announcement" });
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register TV!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pb-16 rounded-lg bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register New TV</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="tvId"
            value={formData.tvId}
            onChange={handleChange}
            placeholder="TV ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="tvModel"
            value={formData.tvModel}
            onChange={handleChange}
            placeholder="TV Model"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="tvSize"
            value={formData.tvSize}
            onChange={handleChange}
            placeholder="TV Size"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin mx-auto"/>: "Register TV"}
          </button>
        </form>
      </div>
    </div>
  );
}
