"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaClock, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import FormatDate from "@/app/utils/dateFormater";
import { useSelector } from "react-redux";

const ScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending"); 
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("https://tvmsb.onrender.com/api/schedule/getAllSchedules");
      setSchedules(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

 

  
  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancel Schedule",
    });
  
    if (result.isConfirmed) {
      try {
        await axios.post(`https://tvmsb.onrender.com/api/schedule/cancel`, { _id: id });
  
        setSchedules((prevSchedules) =>
          prevSchedules.map((schedule) =>
            schedule._id === id ? { ...schedule, status: "Cancelled" } : schedule
          )
        );
  
        Swal.fire({
          title: "Canceled!",
          text: "Schedule canceled successfully",
          icon: "success",
        });
      } catch (error) {
        console.error("Error canceling schedule:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  const deleteSchedule = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete Schedule history",
    });
  
    if (result.isConfirmed) {
      try {
        await axios.post(`https://tvmsb.onrender.com/api/schedule/delete`, { _id: id });
  
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) =>
            schedule._id !== id 
          )
        );
  
        Swal.fire({
          title: "Deleted!",
          text: "Schedule history deleted successfully",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting schedule history:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error",
        });
      }
    }
  };

  
console.log("schedules",schedules)
  const filteredSchedules = schedules.filter((schedule) =>
    activeTab === "Pending" ? schedule.status === "Pending" : schedule.status !== "Pending"
  );

  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Schedules</h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          className={`py-2 px-4 font-semibold text-lg ${
            activeTab === "Pending"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          } transition-all duration-300`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending
        </button>
        <button
          className={`py-2 px-4 font-semibold text-lg ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-600"
          } transition-all duration-300`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No schedules found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full text-sm text-left bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Target TV</th>
                <th className="px-6 py-4">Start date & time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Scheduled By</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((schedule, index) => (
                <tr
                  key={schedule._id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{schedule.title}</td>
                  <td className="px-6 py-4">{schedule.tvId}</td>
                  <td className="px-6 py-4">{FormatDate(schedule.startDateTime)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {schedule.status === "Pending" && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <FaClock /> Pending
                        </span>
                      )}
                      {schedule.status === "confirmed" && (
                        <span className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle /> Confirmed
                        </span>
                      )}
                      {schedule.status === "Cancelled" && (
                        <span className="flex items-center gap-1 text-red-600">
                          <FaTimesCircle /> Cancelled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{`${user.name} (${user.ID})`}</td>
                  {activeTab === "Pending"? (
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition-all duration-200"
                          onClick={() => handleCancel(schedule._id)}
                        >
                          <FaTrash /> Cancel
                        </button>
                      </div>
                    </td>
                  ):(
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition-all duration-200"
                          onClick={() => deleteSchedule(schedule._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;