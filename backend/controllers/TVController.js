import NewTVModel from "../model/TVCollection.js";
import TVUploadedMedia from "../model/TVSharedMedia.js";

export const RegisterTV = async (req, res) => {
  try {
    const { tvId, tvModel, tvSize, location, channelID } = req.body;

    if (!tvId || !tvModel || !tvSize || !location) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingTV = await NewTVModel.findOne({ tvId });
    if (existingTV) {
      return res.status(400).json({ message: "TV ID already registered!" });
    }

    const newTV = new NewTVModel({ tvId, tvModel, tvSize, location, channelID });
    await newTV.save();

    // Send success response
    res.status(201).json({ message: "TV registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};

// Fetch all registered TVs
export const GetAllTVs = async (req, res) => {
  try {
    const tvs = await NewTVModel.find();
    res.status(200).json(tvs);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};
export const validateDevice=async(req,res)=>{
  try {
    const { deviceId } = req.params;
    const tvExists = await NewTVModel.findOne({ tvId: deviceId });

    if (tvExists) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false });
    }
  } catch (error) {
    console.error("Error validating device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const DeleteTV=async(req, res) => {
  const { tvId } = req.params;
  try {
    
 const tv=await NewTVModel.findOne({tvId:tvId});
const isTVExistInShared=await TVUploadedMedia.findOne({tvId:tvId});
  if(!tv){
    return res.status(404).json({ message: "TV not found" });
  }
  
  await NewTVModel.findByIdAndDelete(tv._id);
  if(isTVExistInShared){
  await TVUploadedMedia.Delete({tvId:tvId});
  }
  res.status(200).json({ message: "TV deleted successfully!" });




    } catch (error) {
    res.status(500).json({ message: "Server error!" });
  

}}
export const CurrentMedia = async(req,res)=>{
  const tvId = req.params.tvId;
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
}

