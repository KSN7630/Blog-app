import express from "express";
import { createComment_post} from './../controllers/comment.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router=express.Router();



router.post('/create',verifyToken,createComment_post);


export default router;