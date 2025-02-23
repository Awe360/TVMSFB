import mongoose from 'mongoose'

 const registeredTV= new mongoose.Schema({
    tvId: {
        type: String,
        required: true,
        unique: true},
    channelID: {
        type: String,
        default:'announcement'
      },
      tvModel: {
        type: String,
        required: true
      },
      schedules:[],
    
      tvSize:{
            type: String,
            required: true
      },
    location: {
        type: String,
        required: true
      },
   
}, { timestamps: true });


const RegisteredTV = mongoose.model('RegisteredTV', registeredTV);
export default RegisteredTV;