"use client"

import { useEffect, useState } from "react";
import axios from "axios";

export default function RegisteredTVs() {
  const [tvs, setTVs] = useState([]);

  useEffect(() => {
    axios
      .get("https://tvmsfb.onrender.com/api/tv/all") 
      .then((response) => setTVs(response.data))
      .catch((error) => console.error("Error fetching TVs:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Registered TVs
      </h1>
      {tvs.length === 0 ? (
        <p className="text-center text-gray-600">No TVs registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tvs.map((tv) => (
            <div
              key={tv._id}
              className="bg-white shadow-lg rounded-xl p-4 transition transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center font-bold text-lg bg-blue-600 text-white py-2 rounded-t-xl">
                {tv.tvId}
              </div>
              <div className="p-4 text-gray-800">
                <p>
                  <span className="font-semibold">Model:</span> {tv.tvModel}
                </p>
                <p>
                  <span className="font-semibold">Size:</span> {tv.tvSize} inches
                </p>
                <p>
                  <span className="font-semibold">Location:</span> {tv.location}
                </p>
                <p>
                  <span className="font-semibold">Channel:</span>{" "}
                  {tv.channelID || "announcement"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
