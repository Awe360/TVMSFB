// Frontend: ManageTVPage.js (Next.js + Tailwind + Framer Motion)
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import RegisterTV from "@/app/components/RegisterNewTV";




export default function ManageTVPage() {
  const [tvs, setTvs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTV, setEditingTV] = useState(null);

  useEffect(() => {
    fetchTVs();
  }, []);

  const fetchTVs = async () => {
    try {
      const res = await axios.get("https://tvmsfb.onrender.com/api/tv/all");
      setTvs(res.data);
    } catch (error) {
      toast.error("Failed to fetch TVs!");
    }
  };

  const handleDelete = async (tvId) => {
    const result = await Swal.fire({
          title: "Are you sure?",
          text: "This step can not be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete TV",
        });
        if (result.isConfirmed) {
    try {
      await axios.post(`https://tvmsfb.onrender.com/api/tv/delete/${tvId}`);
       Swal.fire({
              title: "Deleted!",
              text: `${tvId} deleted successfully`,
              icon: "success",
            });
      fetchTVs();
    } catch (error) {
      Swal.fire({
              title: "Error!",
              text: "Something went wrong",
              icon: "error",
            });
    }}
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage TVs</h1>
        <button onClick={() => setIsModalOpen(true)} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Register TV
        </button>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tvs.map((tv) => (
          <motion.div
            key={tv.tvId}
            className="p-5 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold">{tv.tvModel}</h2>
            <p className="text-gray-600">TV ID: {tv.tvId}</p>
            <p className="text-gray-600">Size: {tv.tvSize}</p>
            <p className="text-gray-600">Location: {tv.location}</p>
            <div className="flex justify-end mt-4 gap-3">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => setEditingTV(tv)}>
                Edit
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(tv.tvId)}>
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-400 p-4  rounded-lg shadow-lg w-96">
            <RegisterTV onClose={() => { setIsModalOpen(false); fetchTVs(); }} />
            <button onClick={() => setIsModalOpen(false)} className="    absolute bottom-16 p-2  bg-gray-600 text-white rounded-lg hover:bg-gray-700">close</button>
          </div>
        </div>
      )}
    </div>
  );
}
