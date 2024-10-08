import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.vl4XEqNqeWA-qtQdW_WlFwHaEK?w=1024&h=576&rs=1&pid=ImgDetMain"
    },
    category:{
        type:String,
        default:'uncategorized'
    },
    slug:{
        type:String,
        unique:true,
        required:true,
    }
    
  },
  {timestamps:true}
);

const Post = mongoose.model('Post', postSchema);
export default Post;