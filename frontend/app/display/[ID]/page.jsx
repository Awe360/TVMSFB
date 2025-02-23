'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader } from 'lucide-react';
import io from 'socket.io-client';

export const socket = io('https://tvmsfb.onrender.com', { 
  autoConnect: false, 
  reconnection: true, 
  reconnectionAttempts: 10,
  reconnectionDelay: 2000, 
});

export default function TVScreen() {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const tvId = localStorage.getItem('deviceId');

    if (!tvId) {
      router.push('/display');
      return;
    }

    const fetchMedia = async () => {
      try {
        const { data } = await axios.get(`https://tvmsfb.onrender.com/api/media/fetch-media/${tvId}`);
        if (data?.mediaUrl) {
          setMediaUrl(data.mediaUrl);
          setMediaType(getMediaType(data.mediaUrl));
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Failed to fetch media.');
      }
    };

    fetchMedia();

    const initializeSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit('joinRoom', tvId);

      socket.on('mediaUpdate', (newMedia) => {
        if (newMedia?.mediaUrl) {
          setMediaUrl(newMedia.mediaUrl);
          setMediaType(getMediaType(newMedia.mediaUrl));
        }
      });

      // Handle disconnection and attempt reconnection
      socket.on('disconnect', () => {
        console.warn('Socket disconnected, attempting to reconnect...');
        setTimeout(() => {
          if (!socket.connected) {
            initializeSocket();
          }
        }, 3000);
      });
    };

    initializeSocket();

    return () => {
      socket.off('mediaUpdate');
      socket.off('disconnect');
    };
  }, [router]);

  const getMediaType = (url) => {
    if (url?.endsWith('.mp4')) return 'video';
    if (url?.match(/\.(gif|jpe?g|png)$/i)) return 'image';
    return null;
  };

  if (error) {
    return <p className="text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      {!mediaUrl ? (
        <Loader className="w-16 h-16 animate-spin text-white" />
      ) : mediaType === 'video' ? (
        <video key={mediaUrl} controls autoPlay loop className="w-full h-full object-fit">
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src={mediaUrl} 
          alt="Media" 
          className="w-full h-full object-contain" 
        />
      )}
    </div>
  );
}
