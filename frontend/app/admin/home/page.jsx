"use client";

import axios from "axios";
import { Loader, Tv } from "lucide-react";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [tvs, setTVs] = useState([]);
  const [selectedTV, setSelectedTV] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all TVs and set TV1 as default if available
  useEffect(() => {
    axios
      .get("https://tvmsb.onrender.com/api/tv/all")
      .then((response) => {
        setTVs(response.data);
        const defaultTV = response.data.find((tv) => tv.tvId === "TV1");
        if (defaultTV) {
          setSelectedTV(defaultTV.tvId);
          fetchMediaByID(defaultTV.tvId);
        }
      })
      .catch((error) => console.error("Error fetching TVs:", error));
  }, []);

  // Fetch media by selected TV ID
  const fetchMediaByID = async (tvID) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`https://tvmsb.onrender.com/api/tv/display/${tvID}`);
      setMediaUrl(data?.mediaUrl || null);
    } catch (error) {
      setError("Error fetching media.");
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine Media Type
  const getMediaType = (url) => {
    if (url?.endsWith(".mp4")) return "Video";
    if (url?.match(/\.(gif|jpe?g|png)$/i)) return "Image";
    return "Unknown";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="bg-white text-gray-900 shadow-2xl rounded-xl px-6 w-full max-w-2xl">

        <div className="mb-4">
          <label className="block text-teal-500 text-3xl pt-2 font-bold mb-2 text-center">Select a TV to view the current content</label>
          <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedTV || ""}
            onChange={(e) => {
              setSelectedTV(e.target.value);
              fetchMediaByID(e.target.value);
            }}
          >
            {tvs.length === 0 ? (
              <option value="">Loading TVs...</option>
            ) : (
              tvs.map((tv) => (
                <option key={tv._id} value={tv.tvId}>
                  {tv.tvId} - {tv.location}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Display Content */}
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader className="animate-spin w-8 h-8 text-blue-500" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : mediaUrl ? (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col items-center">

            {/* Media Display with Styling */}
            {getMediaType(mediaUrl) === "Image" && (
              <img
                src={mediaUrl}
                alt="TV Media"
                className="rounded-lg shadow-md max-h-[60vh] w-auto object-contain"
              />
            )}

            {getMediaType(mediaUrl) === "Video" && (
              <video
                src={mediaUrl}
                controls
                className="rounded-lg shadow-md w-full max-h-[60vh] object-contain"
              />
            )}

            {getMediaType(mediaUrl) === "Unknown" && (
              <p className="text-gray-500 text-center">Unknown media type</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Select a TV to view media</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;