//admin schema
import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        default: 'admin'

    },
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin','SuperAdmin'],
        default:'admin'
    },
    status:{
        type: String,
        default: "Unblocked"
    }
    ,
    resetPasswordToken: String,
	resetPasswordExpiresAt: Date,
    },
    { timestamps: true });
const AdminModel = mongoose.model('AdminModel', adminSchema);
export default AdminModel;