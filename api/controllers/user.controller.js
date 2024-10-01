import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { errorhandler } from './../utils/error.js';


import jwt from 'jsonwebtoken';
import 'dotenv/config'


export const test_get=(req,res)=>{
    res.send("This is test request");
}


export const signup_post=async(req,res,next)=>{
    const {username ,email,password}= req.body;
    if(!username || !email || !password || username==='' || password==='' || username===''){
        // return res.status(400).json({message:"All fields are required"});
        next(errorhandler(400,"All fields are required"));
    }

    //from bcryptjs  documentation -- take syntax
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const user= new User({
        username,email,
        password:hashPassword
    });
    try{
        const savedUser=await user.save();
        res.status(200).json({message:"Sign-Up Successful"});
    }catch(err){
        next(err);   //  to pass error to errorhandler middleware in index.js
    }
    
}


export const signin_post=async(req,res,next)=>{
    const {email,password}= req.body;
    if(!email  || !password || password==='' || email===''){
        next(errorhandler(400,"All fields are required"));
    }
    try{
        const userFromDb=await User.findOne({email:req.body.email});
        if(!userFromDb){
            next(errorhandler(404,"Please Sign-Up using your email"));
        }
        const isSame=bcrypt.compareSync(password, userFromDb.password); 
       
        if(!isSame){
            return next(errorhandler(400,"Invalid email or password"));
        }

        //we will use jsonwebtoken  to save user info in cookie of browser
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            id:userFromDb._id
          }, process.env.JWT_SECRET);
        const {password:pass,...rest}=userFromDb._doc;
        res.status(200).cookie('access_token',token,{httpOnly:true}).json(rest) ;
        
    }catch(err){
        next(err);   //  to pass error to errorhandler middleware in index.js
    }
    
}




export const google_post =async (req,res,next)=>{
    const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id},
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};