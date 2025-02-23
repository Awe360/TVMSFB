import mongoose from 'mongoose';

const mediaCollectionSchema = new mongoose.Schema(
  {

    title:{type:String,
        required:true
        },

    mediaUrl: {
      type: String,
      required: true
    },
    public_id:{
      type:String,
      required:true,
    },
   
    description: {
      type: String,
      required: true
    },
    mediaCategory: {
      type: String,
      required: true
    },
 
  },
  { timestamps: true }
);


const MediaCollection = mongoose.model('MediaCollection', mediaCollectionSchema);
export default MediaCollection;
