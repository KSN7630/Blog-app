import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"https://i1.rgstatic.net/ii/profile.image/1142222359674881-1649338440466_Q512/Ab-Cd-120.jpg"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
    
  },
  {timestamps:true}
);

const User = mongoose.model('User', userSchema);
export default User;