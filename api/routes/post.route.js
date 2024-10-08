import express from "express";
import { verifyToken } from './../utils/verifyUser.js';
import { create_post, get_post_get } from "../controllers/post.controller.js";

const router=express.Router();



router.post('/create',verifyToken,create_post)
router.get('/getposts',get_post_get)


export default router;
