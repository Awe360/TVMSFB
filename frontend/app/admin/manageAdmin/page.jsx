"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import AdminRegister from "./addNewAdmin/RegisterNewTV";
import { toast } from "react-toastify";
import { setUser } from "@/app/redux/authSlice";
import Swal from "sweetalert2";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [blockedAdmins, setBlockedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("unblocked"); 
  const user = useSelector((state) => state.auth.user);


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("https://tvmstd.onrender.com/api/admin/get-all-admin");
        const allAdmins = response.data;
        setAdmins(allAdmins.filter((admin) => admin.status === "Unblocked"));
        setBlockedAdmins(allAdmins.filter((admin) => admin.status === "Blocked"));
      } catch (err) {
        setError("Failed to fetch admins. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleBlock = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This admin can not login to the system untile you unblock manually.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Block Admin",
    });

    if (result.isConfirmed) {
    try {
    const response= await axios.post("https://tvmstd.onrender.com/api/admin/block-admin", { userId: id }); 
      setAdmins((prev) => prev.filter((admin) => admin.ID !== id));
      setBlockedAdmins((prev) => [...prev, admins.find((admin) => admin.ID === id)]);
      Swal.fire({
        title: "Blocked!",
        text: "Admin blocked successfully",
        icon: "success",
      });
    } catch (error) {
      console.log("Error blocking admin:", error);
      
      Swal.fire({
        title: "Error!",
        text: error.response.data.message || "Something went wrong",
        icon: "error",
      });
    }}
  };

  const handleUnblock = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Admin will be granted same access as other admins.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unblock Admin",
    });
    if (result.isConfirmed) {
    try {
      await axios.post("https://tvmstd.onrender.com/api/admin/unblock-admin", { userId: id });
      setBlockedAdmins((prev) => prev.filter((admin) => admin.ID !== id));
      setAdmins((prev) => [...prev, blockedAdmins.find((admin) => admin.ID === id)]);
      Swal.fire({
        title: "Unblocked!",
        text: "Admin unblocked successfully",
        icon: "success",
      });
    } catch (error) {
      console.log("Error unblocking admin:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error",
      });
    }}
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete Admin",
    });

    if (result.isConfirmed) {
      try {
        await axios.post("https://tvmstd.onrender.com/api/admin/delete", { userId: id });
        setAdmins((prev) => prev.filter((admin) => admin.ID !== id));
        setBlockedAdmins((prev) => prev.filter((admin) => admin.ID !== id));

        Swal.fire({
          title: "Blocked!",
          text: "Admin deleted successfully",
          icon: "success",
        });
      } catch (error) {
        console.log("Error deleting admin:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  const filteredAdmins = (activeTab === "unblocked" ? admins : blockedAdmins).filter(
    (admin) =>
      admin?.name?.toLowerCase().includes(search.toLowerCase()) ||
      admin?.email?.toLowerCase().includes(search.toLowerCase()) ||
      admin?.ID?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      {user?.role === "SuperAdmin" && (
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Admin
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <AdminRegister />
            <button
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin List</h2>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "unblocked" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("unblocked")}
        >
          Unblocked Admins
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "blocked" ? "bg-red-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setActiveTab("blocked")}
        >
          Blocked Admins
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, email, or ID..."
        autoFocus
        className="w-full p-2 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="text-center text-blue-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-50 shadow-md rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                {user?.role === "SuperAdmin" && <th className="p-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.ID} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      <img
                        src={admin.profileImage || "https://via.placeholder.com/40"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="p-3">{admin.name}</td>
                    <td className="p-3">{admin.ID}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3 capitalize">{admin.role}</td>
                    {user?.role === "SuperAdmin" && (
                      <td className="p-3 flex space-x-2">
                        {activeTab === "unblocked" ? (
                          <button onClick={() => handleBlock(admin.ID)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                            Block
                          </button>
                        ) : (
                          <button onClick={() => handleUnblock(admin.ID)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                            Unblock
                          </button>
                        )}
                        <button onClick={() => handleDelete(admin.ID)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
