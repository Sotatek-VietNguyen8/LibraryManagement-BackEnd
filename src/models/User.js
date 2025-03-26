import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        Identification: {
            type: String,
            required: true, 
            unique: true
        },
        userName: {
            type: String,
            required: true 
        },
        password: {
            type: String,
            required: true, 
            minLength: 6
        },
        position: {
            type: String,
            required: true 
        },
        lop:{
            type: String,
            required: false
        },
        SDT:{
            type: String,
            required: false
        },
        email:{
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;