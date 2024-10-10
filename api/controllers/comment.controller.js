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



export const getPostComments_post=async(req,res,next)=>{

    try{
        const comment=await Comment.find({postId:req.params.postId}).sort({createdAt:-1}); //newwesst one at top
        res.status(200).json(comment);
    }catch(err){
        next(err);
    }
}



export const likeComment_put =async(req,res,next)=>{

    try{
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorhandler(404,'Comment not found'));
        }
        const userIndex=comment.likes.indexOf(req.user.id);
        if(userIndex===-1){
            comment.likes.push(req.user.id);
            comment.numberOfLikes+=1;
        }
        else{
            comment.likes.splice(userIndex,1);
            comment.numberOfLikes-=1;
        }
        await comment.save();
        res.status(200).json(comment);
    }catch(err){
        next(err);
    }
}

export const editComment_put=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorhandler(404,'Comment not found'));
        }
        if(comment.userId !== req.user.id  && !req.user.isAdmin){
            return next(errorhandler(403,"You are not allowed to edit this comment"));
        }
        const editedComment=await Comment.findByIdAndUpdate(req.params.commentId,{
            content:req.body.content
        },{new:true});
        res.status(200).json(editedComment);
    }catch(err){
        next(err);
    }
}



export const deleteComment_delete =async(req,res,next)=>{

    try{
        const comment=await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorhandler(404,'Comment not found'));
        }
        if(comment.userId!==req.user.id  && !req.user.isAdmin){
            return next(errorhandler(403,"You are not allowed to delete this comment"));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment deleted successfully');
    }catch(err){
        next(err);
    }
}


export const getComments_get =async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorhandler(403,"You are not allowed to view all comments"));
    }
    try{
        const startIndex=parseInt(req.query.startIndex) || 0 ;
        const limit=parseInt(req.query.limit) || 9;
        const sortdirection=req.query.sort==='asc'? 1 : -1;
        const comments=await Comment.find().sort({createdAt:sortdirection}).skip(startIndex).limit(limit);
        const totalComments=await Comment.countDocuments();
        const now=new Date();
        const oneMonthAgo=new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
        const lastMonthComments=await Comment.countDocuments({
            createdAt:{$gte:oneMonthAgo}
        });
        res.status(200).json({comments,totalComments, lastMonthComments});
    }catch(err){
        next(err);
    }
}