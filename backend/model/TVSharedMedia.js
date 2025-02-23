import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    tvId: {
      type: String,
      required: true
    },
    mediaUrl: {
      type: String,
      required: true
    },
    title:{type:String,
    required:true
    },
    description: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
    }
  },
  { timestamps: true }
);


const TVUploadedMedia = mongoose.model('TVUploadedMedia', mediaSchema);
export default TVUploadedMedia;
