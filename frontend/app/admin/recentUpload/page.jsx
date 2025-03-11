'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function MediaGallery() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data } = await axios.get('https://tvmstd.onrender.com/api/media/recent-media?limit=10');
        setMediaList(data);
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const getMediaType = (url) => {
    if (url?.endsWith('.mp4')) return 'Video';
    if (url?.match(/\.(gif|jpe?g|png)$/i)) return 'Image';
    return 'Unknown';
  };

  if (loading) {
   
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          {/* <h1 className="text-3xl font-bold text-center mb-6 text-teal-500">Media Gallery</h1> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
  
  }

  return (
    <div className="min-h-screen  text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-teal-500">Recent Media Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
        {mediaList.map((media) => (
          <div key={media._id} className="relative group bg-gray-800 p-2 rounded-lg cursor-pointer">
            <div className="relative w-full h-48 overflow-hidden rounded-lg">
              {getMediaType(media.mediaUrl) === 'Video' ? (
                <video src={media.mediaUrl}  className="w-full h-full object-cover" controls />
              ) : (
                <img src={media.mediaUrl} alt="Media" className="w-full h-full object-cover" />
              )}
              <div className="absolute top-5 left-2 bg-blue-500 bg-opacity-75 text-white text-sm px-2 py-1 rounded hidden group-hover:block">
                {media.title}
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm truncate w-2/4 hover:underline" onClick={() => router.push(`/admin/recentUpload/${media._id}`)}>{media.description || 'No Description Prodivded'}</p>
              <Link href={`/admin/recentUpload/${media._id}`} className="bg-yellow-400 rounded-lg p-2 text-center text-black hover:opacity-75">View detail</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
