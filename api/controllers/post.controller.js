import Post from "../models/post.model.js";
import { errorhandler } from "../utils/error.js"

export const create_post=async (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorhandler(403,"You are not allowed to create a post"));
    }
    if(!req.body.title || !req.body.content){
        return next(errorhandler(400,"Please provide all required fields"));
    }
    const slug=req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
    const newPost=new Post({
        ... req.body,
        slug,
        userId:req.user.id
    });
    
    try{
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        next(err);
    }
    

}


export const get_post_get = async (req, res, next) => {  
    try {
        // Use parseInt instead of parsedInt
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortdirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { postId: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } }, // Assuming you want to search the 'title'
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            })
        })
        .sort({ updatedAt: sortdirection })
        .skip(startIndex)
        .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({ posts, totalPosts, lastMonthPosts });
    } catch (err) {
        next(err);
    }
};
