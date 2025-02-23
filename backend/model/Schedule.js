//admin schema
import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
  
  mediaId:{
    type: String,
    required: true,
    
  },
  tvId:{
    type: String,
    required: true,
  },

  scheduledBy:{
    type: String,
    required: true,
    default: 'Admin',
  },
  title:{
    type: String,
    required: true,
  },
  
  status:{
    type: String,
    required: true,
    default: 'Pending',
    enum:['Pending', 'Confirmed', 'Cancelled'],
  },
  startDateTime:{
    type: Date,
    required: true,
  },
  endDateTime:{
    type: Date,
  },
    },
    { timestamps: true });
const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;