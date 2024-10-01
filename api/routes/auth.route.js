import express from  'express';
const router = express.Router();
import { signup_post,signin_post, google_post } from '../controllers/user.controller.js';


router.post('/signup',signup_post);
router.post('/signin',signin_post);
router.post('/google',google_post);

export default router;