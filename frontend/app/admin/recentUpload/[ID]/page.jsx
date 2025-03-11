'use client'

import axios from 'axios';
import { Loader, Trash2, Edit } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ScheduleModal from "@/app/components/ScheduleModal";
import { useSelector } from 'react-redux';



const DetailPage = () => {
  const mediaID = useParams().ID;
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const[tvs,setTVs]=useState([]);
  const [isDelete,setIsDelete]=useState(false);
  const[uploadData,setUploadData]=useState()
  const[isDisplay,setIsDisplay]=useState(false)
  const[current,setCurrent]=useState(false)
  const router=useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [selectedTvId, setSelectedTvId] = useState(null);
  const[mediaUrl, setMediaUrl] =useState(null);
  const[mediaId,setMediaId]=useState(null);
  const[public_id,setPublicId] = useState(null);
  const[mediaCategory,setMediaCategory]=useState(null);
  const user=useSelector((state)=>state.auth.user)
  
  useEffect(() => {
    axios
      .get("https://tvmstd.onrender.com/api/tv/all")
      .then((response) => setTVs(response.data))
      .catch((error) => console.error("Error fetching TVs:", error));
  }, []);
  const fetchMediaByID = async () => {
    try {
      const { data } = await axios.get(`https://tvmstd.onrender.com/api/media/find-media/${mediaID}`);
      setMediaData(data);
     
      
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaByID();
  }, [mediaID]);

  const getMediaType = (url) => {
    if (url?.endsWith('.mp4')) return 'Video';
    if (url?.match(/\.(gif|jpe?g|png)$/i)) return 'Image';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-w-full min-h-full bg-black flex justify-center items-center">
        <Loader size={60} className="animate-spin mx-auto text-white" />
      </div>
    );
  }

  const handleSchedule = async ({ mediaId, tvId,mediaUrl,public_id,mediaCategory, startDateTime, endDateTime, title, description ,schduledBy}) => {
    try {
      // Make API call
      const response = await axios.post('https://tvmstd.onrender.com/api/schedule/setSchedule',{mediaId, tvId,mediaUrl,public_id,mediaCategory, startDateTime, endDateTime, title, description });
      return response?.data
    
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleScheduleSubmit = async (data) => {
    const { startDateTime, endDateTime, title, description } = data;

    // Close the modal first
    setIsModalOpen(false);

    // Open confirmation Swal
    const result = await Swal.fire({
      title: "Confirm Schedule",
      html: `
        <div style="text-align: left;">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Target TV:</strong> ${selectedTvId}</p>
          <p><strong>Start Date & Time:</strong> ${new Date(startDateTime).toLocaleString()}</p>
          ${
            endDateTime
              ? `<p><strong>End Date & Time:</strong> ${new Date(endDateTime).toLocaleString()}</p>`
              : ""
          }
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm Schedule",
      cancelButtonText: "Cancel",
    });

    // If confirmed, send API request
    if (result.isConfirmed) {
      await handleSchedule({ 
        mediaId,
        mediaUrl,
        public_id,
        mediaCategory,
        tvId: selectedTvId,  
        startDateTime, 
        endDateTime, 
        title, 
        description,
        schduledBy:`${user.name},'(', ${user.ID}`
      });

      Swal.fire("Scheduled!", "Your event has been scheduled.", "success");
    }
  };


  
  const deleteMedia = async ({id,public_id,mediaType}) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete media"
    });

    if (result.isConfirmed) {
      try {
        setIsDelete(true)
        console.log("request;",id,public_id,mediaType);
        await axios.post(`https://tvmstd.onrender.com/api/media/deleteMedia`,  { id,public_id,mediaType} );
        
        Swal.fire({
          title: "Deleted!",
          text: "Media deleted successfully",
          icon: "success"
        }).then(() => {
          router.push(`/admin/recentUpload`);
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong",
          icon: "error"
        });
      }
      finally{
        setIsDelete(false)
    }
    }
  };
  // console.log("log data",mediaData[0])
  
  const displytoTVs=async({_id,tvId,mediaUrl,public_id,title,description,mediaCategory})=>{
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to display the content to ${tvId}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, I want to Display"
    });
    if (result.isConfirmed){
      setIsDisplay(true);

    try {
     const res= await axios.post("https://tvmstd.onrender.com/api/media/display-to-tv", {
      _id,tvId,mediaUrl,public_id,title,description,mediaCategory});
        console.log("response",res.data)
        toast.success(`successfull,media is live on ${tvId}`);
    
      
    } catch (error) {
      console.log("error",error.message)
      toast.error("Failed to Send");
    }
  finally{
    setIsDisplay(false)
  }}
   
  }

  return (
    <div className="flex  flex-col md:flex-row p-8 bg-gray-300 min-h-screen">
      <div className="w-full lg:w-2/3 lg:pr-8 mb-8 lg:mb-0">
        {mediaData?.map((media) => (
          <div key={media._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="relative">
              {getMediaType(media.mediaUrl) === 'Video' ? (
                <video src={media.mediaUrl} className="w-full h-96 object-cover" controls />
              ) : (
                <img src={media.mediaUrl} alt="Media" className="w-full h-96 object-cover" />
              )}
              <div className="absolute top-4 left-4 bg-blue-500 bg-opacity-75 text-white text-sm px-3 py-1 rounded">
                {media.title}
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-sm mb-4">{media.description || 'No Description Provided'}</p>
              <div className="flex justify-end space-x-4">
                <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={() => deleteMedia({id:media._id,public_id:media.public_id,mediaType:getMediaType(media.mediaUrl)})}>
                  <Trash2 size={18} className="mr-2" />
                  {isDelete? <Loader className='animate-spin'/>: "Delete"}
                </button>
                {/* <button className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  <Edit size={18} className="mr-2" />
                  Update
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full lg:w-2/3 lg:pl-8">
        <div className="bg-teal-300 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold  text-center mb-4">Select your Preference</h2>
          <ul className="space-y-4">
            {tvs?.map((tv, index) => (
              <li key={index} className="flex flex-col sm:flex-row items-center justify-between bg-violet-800 p-2 md:p-4 rounded-lg space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-white font-semibold bg-gradient-to-r from-green-500 to-pink-600 px-4 py-1 rounded-lg shadow-md">
  {tv.tvId}
</span>

                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={()=>{displytoTVs({
                  _id:mediaData[0]._id,
                  tvId:tv.tvId,
                  mediaUrl:mediaData[0].mediaUrl,
                  public_id:mediaData[0].public_id,
                  title:mediaData[0].title,
                  description:mediaData[0].description,
                  mediaCategory:mediaData[0].mediaCategory})
                  setCurrent(tv.tvId)}}>
                  {isDisplay && current===tv.tvId? <Loader className='animate-spin'/>:"Upload"}
                </button>
                <button className="bg-gradient-to-r from-yellow-500 to-purple-600 text-white font-semibold px-3 md:px-5 py-2 rounded-lg shadow-md transition duration-300 hover:from-purple-600 hover:to-yellow-500 hover:scale-105" onClick={() => {setIsModalOpen(true),setSelectedTvId(tv.tvId),setMediaId(mediaData[0]._id),setMediaUrl(mediaData[0].mediaUrl),setPublicId(mediaData[0].public_id),setMediaCategory(mediaData[0].mediaCategory)}}>
  Schedule
</button>
<ScheduleModal 
  isOpen={isModalOpen} 
  title={mediaData[0]?.title || ""}
  description={mediaData[0]?.description || ""}
  onClose={() => setIsModalOpen(false)} 
  onSubmit={handleScheduleSubmit} 
/>


              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;