import express from "express";
import { verifyToken } from './../utils/verifyUser.js';
import { create_post, get_post_get,delete_post_delete } from "../controllers/post.controller.js";

const router=express.Router();



router.post('/create',verifyToken,create_post)
router.get('/getposts',get_post_get)
router.delete('/deletepost/:postId/:userId',verifyToken,delete_post_delete)


export default router;
