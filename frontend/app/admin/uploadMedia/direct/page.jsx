'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Loader, Upload } from "lucide-react";

const CloudinaryUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [tvs, setTVs] = useState([]);
  const [selectedTv, setSelectedTv] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("");
  const[submit,setSubmit]=useState(false);

  useEffect(() => {
    axios
      .get("https://tvmsb.onrender.com/api/tv/all")
      .then((response) => setTVs(response.data))
      .catch((error) => console.error("Error fetching TVs:", error));
  }, []);

  const handleFileChange = (file) => {
    setProgress(0);
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setCloudinaryUrl("");
  };

  const { getRootProps, getInputProps,isDragActive } = useDropzone({
    accept: "image/*,video/*,image/gif",
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles[0]),
  });

  const handleUpload = async () => {
    setSubmit(true);
    
    // Validate input fields
    if (!file || !selectedTv || !title || !description || !mediaType) {
      toast.error("Please fill all fields.");
      setSubmit(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react-upload");
  
    try {
      // Upload to Cloudinary
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dtinrmkcf/upload",
        formData,
        {
          withCredentials: false,
          onUploadProgress: (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
          },
        }
      );
  
      console.log("Cloudinary response:", response.data);
  
      const uploadedUrl = response.data.secure_url;
      const public_id = response.data.public_id;
  
      setCloudinaryUrl(uploadedUrl);
  
      // Save media details to the backend
      await axios.post("https://tvmsb.onrender.com/api/media/save", {
        tvId: selectedTv,
        mediaUrl: uploadedUrl,
        public_id,
        title,
        description,
        mediaType,
      });
  
      toast.success("Media uploaded and saved successfully!");
  
      // Reset form fields
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      setMediaType("");
      setSelectedTv("");
  
    } catch (error) {
      console.error("Upload failed:", error);
  
      // Handle Cloudinary API errors
      if (error.response) {
        toast.error(`Upload failed: ${error.response.data.error?.message || "Unknown error"}`);
      } else if (error.request) {
        toast.error("No response from Cloudinary. Check your network.");
      } else {
        toast.error("Something went wrong while uploading.");
      }
  
    } finally {
      setSubmit(false); // Ensure submit state resets in case of failure
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation(); 
    setFile(null); 
  };
  const closeProgressBar=()=>{
   setProgress(0);
  }


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg flex gap-6">
      {/* Form Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4 text-center font-serif text-teal-500">Upload Media</h2>

        <select
          className="w-full p-2 border rounded mb-2"
          value={selectedTv}
          onChange={(e) => {setSelectedTv(e.target.value);setProgress(0)}}
        >
          <option value="">Select a TV to upload media</option>
          {tvs.map((tv) => (
            <option key={tv._id} value={tv.tvId}>{tv.tvId}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => {setTitle(e.target.value);setProgress(0);}}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => {setDescription(e.target.value);setProgress(0);}}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Enter Media Type"
          value={mediaType}
          onChange={(e) => {setMediaType(e.target.value);setProgress(0);}}
          className="w-full p-2 border rounded mb-2"
        />
 <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 text-center cursor-pointer rounded mb-4 transition-all duration-200 
        ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
    >
      <input {...getInputProps()}  />
      {!file ? (
        <p className="text-gray-600">
          <Upload size={24} className="mx-auto" />
          {isDragActive
            ? "Drop the file here..."
            : "Drag & drop a file here, or click to select one"}
        </p>
      ) : (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
          <span className="text-gray-700 truncate">{file?.name}</span>
          <button
            onClick={handleDelete} 
            className="text-red-500 hover:text-red-700"
          >
            ✖
          </button>
        </div>
      )}
    </div>


        {progress > 0 && (
          <div className="mb-2">
            <progress value={progress} max="100" className="w-full" />
            <p className="text-center text-sm">{progress}% uploaded {progress ===100 && <span>✅</span>
             }</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={!file || !selectedTv || !title || !description || !mediaType}
        >
          {submit? <Loader className="animate-spin mx-auto"/> :"Upload"}
        </button>
      </div>

      {/* Preview Section */}
      {preview && file && (
        <div className="flex-1 flex items-center justify-center">
          {file?.type.startsWith("image") ? (
            
            <img src={preview} alt="Preview" className="max-h-80 border rounded" />
          ) : (
            <video controls className="max-h-80 border rounded">
              <source src={preview} type={file?.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;