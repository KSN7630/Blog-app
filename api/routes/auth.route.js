import express from  'express';
const router = express.Router();
import { signup_post,signin_post, google_post,signout } from '../controllers/user.controller.js';


router.post('/signup',signup_post);
router.post('/signin',signin_post);
router.post('/google',google_post);
router.post('/signout',signout);

export default router;