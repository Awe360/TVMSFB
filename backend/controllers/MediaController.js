// import Media from '../model/TVSharedMedia.js';
import TVUploadedMedia from '../model/TVSharedMedia.js';
import cloudinary from '../config/cloudinary.js';

import { io } from '../socket/index.js';
import MediaCollection from '../model/MediaCollection.js';


export const UploadMedia = async (req, res) => {
  const { tvId } = req.body;
  const file = req.file;


  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded!' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const media = new TVUploadedMedia({ tvId, mediaUrl: result.secure_url });
    await media.save();

    io.to(tvId).emit('mediaUpdate', { mediaUrl: result.secure_url });

    res.status(200).json({ success: true, mediaUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const FetchLatestMedia = async (req, res) => {
  const { tvId } = req.params;
  try {
    const media = await TVUploadedMedia.findOne({ tvId }).sort({ createdAt: -1 });
    if (media) {
      res.status(200).json({ mediaUrl: media.mediaUrl });
    } else {
      res.status(404).json({ error: `No media found for TV ID: ${tvId}` });
    }
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const SaveMedia = async (req, res) => {
  try {
    const { title, tvId, mediaUrl,description,mediaType,public_id } = req.body;
     console.log("pay load",req.body);

    if (!title || !tvId || !mediaUrl || !description || !mediaType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    io.to(tvId).emit('mediaUpdate', { mediaUrl: mediaUrl });
    const sharedMedia = new TVUploadedMedia({ title:title, tvId:tvId, mediaUrl:mediaUrl,description:description,mediaType:mediaType });
    await sharedMedia.save();
    const mediaCollection=new MediaCollection({_id:sharedMedia._id,title:title,mediaUrl:mediaUrl,description:description,mediaCategory:mediaType,public_id:public_id});
    await mediaCollection.save();
    

    res.status(201).json({success: true, message: "Media saved successfully", mediaUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const DisplayToTV = async (req, res) => {
  try {
    const { _id, title, tvId, mediaUrl, description, mediaCategory, public_id } = req.body;
    console.log("payload", req.body);

    if (!title || !tvId || !mediaUrl || !description || !mediaCategory) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const isExist = await TVUploadedMedia.findById(_id);

    if (isExist) {await TVUploadedMedia.findByIdAndDelete(_id);}
    await MediaCollection.findByIdAndDelete(_id);
    

    const newMedia = new TVUploadedMedia({
      _id: _id,
      title: title,
      tvId: tvId,
      mediaUrl: mediaUrl,
      public_id: public_id,
      description: description,
      mediaType: mediaCategory,
    });
    await newMedia.save();
    const mediaCollection = new MediaCollection({
      _id: _id,
      title: title,
      mediaUrl: mediaUrl,
      public_id: public_id,
      description: description,
      mediaCategory: mediaCategory,
    });
    await mediaCollection.save();
    
    // setTimeout(()=>{io.to(tvId).emit("mediaUpdate", { mediaUrl: mediaUrl });},50000)
    io.to(tvId).emit("mediaUpdate", { mediaUrl: mediaUrl })


    return res.status(200).json({ message: "Media successfully registered" });
  } catch (error) {
    console.error("Error in DisplayToTV:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RecentMedia=async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const media = await MediaCollection.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: "Error fetching media", error });
  }
}
export const FetchMediaBYID=async (req, res) => {
  try {
    const ID=req.params.mediaID;
    // console.log("ID",ID);
    const media = await MediaCollection.find({_id:ID});
    if (media) {
      res.status(200).json(media);
    }else{
      res.status(404).json({ message: "No media found" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching media", error });
  }
}
export const DeleteMedia = async (req, res) => {
  // console.log("pay load",req.body);
  const { id: _id, public_id,mediaType } = req.body; 


  if (!_id) return res.status(400).json({ success: false, message: "Media ID is required" });
  if (!public_id) return res.status(400).json({ success: false, message: "public_id is required" });
  

  try {
    // console.log("media Data")
    // const mediaData = await cloudinary.api.resource(public_id);
    // console.log("media Data",mediaData)
    // const resourceType = mediaData.resource_type;
    // console.log("resourcetype",resourceType);
    const mediaCollection = await MediaCollection.findById(_id);
    console.log("media",mediaCollection)
    if (!mediaCollection) return res.status(404).json({ success: false, message: "Media not founddd" });
    const isShared=await TVUploadedMedia.findById(_id);
   
   
    const result = await cloudinary.uploader.destroy(public_id, { resource_type:mediaType.toLowerCase()});
    if (result.result !== "ok") {
      return res.status(400).json({ success: false, message: "Failed to delete file from Cloudinary" });
    }

    await MediaCollection.findByIdAndDelete(_id);
    if(isShared){
      console.log("shared")
      await TVUploadedMedia.findByIdAndDelete(_id);
      const latestMedia = await TVUploadedMedia.findOne().sort({ createdAt: -1 });
      // console.log("Latest media",latestMedia)
      const tvId=latestMedia.tvId
      const url=latestMedia.mediaUrl
      io.to(tvId).emit('mediaUpdate', { mediaUrl: url});
    }

    res.status(200).json({ success: true, message: "Media deleted successfully" });

  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const StoreMedia = async (req, res) => {
  try {
    const { title, mediaUrl,description,mediaCategory,public_id } = req.body;
     console.log("pay load",req.body);

    if (!title || !mediaUrl || !description || !mediaCategory || !public_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // io.to(tvId).emit('mediaUpdate', { mediaUrl: mediaUrl });
    // const newMedia = new MediaCollection({ title:title, mediaUrl:mediaUrl,description:description,mediaType:mediaType });
    // await newMedia.save();
    const mediaCollection=new MediaCollection({title:title,mediaUrl:mediaUrl,description:description,mediaCategory:mediaCategory,public_id:public_id});
    await mediaCollection.save();
    

    res.status(201).json({success: true, message: "Media stored successfully", mediaUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


























