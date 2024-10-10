import express from "express";
import { createComment_post ,getPostComments_post,likeComment_put,editComment_put,deleteComment_delete} from './../controllers/comment.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router=express.Router();



router.post('/create',verifyToken,createComment_post);
router.get('/getPostComments/:postId',getPostComments_post);
router.put('/likeComment/:commentId',verifyToken,likeComment_put);
router.put('/editComment/:commentId',verifyToken,editComment_put);
router.delete('/deleteComment/:commentId',verifyToken,deleteComment_delete);


export default router;