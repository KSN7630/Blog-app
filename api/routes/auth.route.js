import express from  'express';
const router = express.Router();
import { signup_post } from '../controllers/user.controller.js';


router.post('/signup',signup_post);


export default router;