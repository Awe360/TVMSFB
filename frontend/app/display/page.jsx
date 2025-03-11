"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader } from "lucide-react";

export default function ValidatorPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const[validate,setValidate]=useState(true);

  useEffect(()=>{
    const validator=async() => {
    // Check if deviceId exists in local storage
    const storedDeviceId = localStorage.getItem("deviceId");
    
    if (storedDeviceId) {
    //   router.push(`/display/${storedDeviceId}`);
    try {
        const response = await axios.get(`https://tvmstd.onrender.com/api/tv/validate-device/${storedDeviceId}`);
        if (response.data.valid) {
          router.push(`/display/${storedDeviceId}`);
        } else {
          router.push('/display')
          setValidate(false)
        }
      } catch (err) {
        setError("Server error. Please try again.");
        
      }
     
    }
    else{
      router.push('/display')
      setValidate(false)
    }
  };validator()}, [router]);

  const handleValidation = async () => {
    setError("");
    if (!deviceId) {
      setError("Please enter your assigned ID.");
      return;
    }

    setLoading(true);

    if (deviceId.startsWith("TV")) {
      try {
        const response = await axios.get(`https://tvmstd.onrender.com/api/tv/validate-device/${deviceId}`);
        if (response.data.valid) {
          localStorage.setItem("deviceId", deviceId);
          router.push(`/display/${deviceId}`);
        } else {
          setError("Invalid  ID. Please check and try again.");
        }
      } catch (err) {
        setError("Server error. Please try again.");
      }
    } else if (deviceId.startsWith("AD")) {
        {
            try {
              const response = await axios.post("https://tvmstd.onrender.com/api/admin/validate-admin",{deviceId});
              if (response.data.autherized) {
                router.push("/auth/login");
              } else {
                setError("Invalid ID. Please check and try again.");
              }
            } catch (err) {
              setError("Server error. Please try again.");
            }
          } 
      
    } 
    
    else {
      setError("Invalid ID .");
    }

    setLoading(false);
  };
 

  return (
    validate? (<div className="flex items-center justify-center w-screen h-screen bg-black">
            <Loader className="w-16 h-16 animate-spin text-white" />
            </div>):(<div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Device Authentication</h2>
      
        <input
          type="text"
          placeholder="Enter your assigned ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleValidation}
          className="w-full mt-4 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Validating'  : "Proceed"}
        </button>
      </div>
    </div>));

            }

