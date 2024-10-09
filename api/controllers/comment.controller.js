import Comment from "../models/comment.model.js";
import { errorhandler } from './../utils/error.js';

// Create a comment
export const createComment_post = async (req, res,next) => {
    try {
        const { content, postId,userId } = req.body;
        if(userId!==req.user.id){
            return next(errorhandler(403,"You are not allowed to create a comment"));
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        });
        await newComment.save();
        
        res.status(200).json(newComment);
       
    } catch (err) {
        next(err);
    }
};
