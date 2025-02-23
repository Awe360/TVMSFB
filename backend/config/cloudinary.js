import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Set up Cloudinary with environment variables
cloudinary.config({
  cloud_name: 'dtinrmkcf',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("API Key:", process.env.CLOUDINARY_API_KEY);

export default cloudinary;
