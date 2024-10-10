import express from "express";
import { createComment_post ,getPostComments_post} from './../controllers/comment.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router=express.Router();



router.post('/create',verifyToken,createComment_post);
router.get('/getPostComments/:postId',getPostComments_post);


export default router;