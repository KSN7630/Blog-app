import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { errorhandler } from './../utils/error.js';
import axios from 'axios';



import jwt from 'jsonwebtoken';
import 'dotenv/config'
import bcryptjs from "bcryptjs";
import { Leet_User } from "../models/LeetCode_User.js";


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
        return next(errorhandler(400,"All fields are required"));
    }
    try{
        const userFromDb=await User.findOne({email:req.body.email});
        if(!userFromDb){
          return next(errorhandler(404,"Please Sign-Up using your email"));
        }
        const isSame=bcrypt.compareSync(password, userFromDb.password); 
       
        if(!isSame){
            return next(errorhandler(400,"Invalid email or password"));
        }

        //we will use jsonwebtoken  to save user info in cookie of browser
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            id:userFromDb._id,
            isAdmin:userFromDb.isAdmin,
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
        { id: user._id ,isAdmin:user.isAdmin},
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
        { id: newUser._id,isAdmin:newUser.isAdmin},
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


export const update_user_put=async(req,res,next)=>{
  const user_id=req.params.id;
  if(req.user.id!=user_id){
    return next(errorhandler(403,"You are not allowed to update this user"));
  }
  if(req.body.password){
    if(req.body.password.length < 6) {
      return next(errorhandler(400,'Password must be at least 6 characters'));
    }
    req.body.pasword=bcryptjs.hashSync(req.body.password,10);
  }
  if(req.body.username){
    if(req.body.username.length <7 || req.body.username.length >20){
      return next(errorhandler(400,'Username must be between 7 and 20 characters'));
    }
    if(req.body.username.includes(' ')){
      return next(errorhandler(400,'Username cannot contain spaces'));
    }
    if(req.body.username !==req.body.username.toLowerCase()){
      return next(errorhandler(400,'Username must be lowercase'));
    }
    if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
      return next(errorhandler(400,'Username can only contain letters and numbers'));
    }
  }
  try{
    const updatedUser=await User.findByIdAndUpdate(user_id,{
      $set:{
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        profilePicture:req.body.profilePicture,
        
      }
    },{new:true});
    const {password,...rest}=updatedUser._doc;
      res.status(200).json(
      rest
    );
  }
  catch(err){
    next(err);
  }
}


export const delete_user_delete= async(req,res,next)=>{

  const userId=req.params.userId;
  
  if(!req.user.isAdmin && req.user.id!=userId){
    return next(errorhandler(403,"You are not allowed to delete this user"));
  }
  try{
    await User.findByIdAndDelete(userId);
    res.status(200).json('User has been deleted');
  }catch(err){
    next(err);
  }
}


export const signout= async (req,res,next)=>{
  try{
    res.clearCookie('access_token').status(200).json('User has been signed out');
  }catch(err){
    next(err);
  }
}



export const get_users_get =async(req, res, next)=>{
  if(!req.user.isAdmin){
    return next(errorhandler(403,"You are not allowed to see users"));
  }
  try{
    const startIndex=parseInt(req.query.startIndex) || 0 ;
    const limit=parseInt(req.query.limit) || 9;
    const sortdirection=req.query.sort==='asc'? 1 : -1;

    const users=await User.find()
                .sort ({createdAt:sortdirection})
                .skip(startIndex)
                .limit(limit);
  
    const usersWithoutPassword=users.map((user)=>{
      const {password, ...rest}=user._doc;
      return rest;
    });

    const totalUsers=await User.countDocuments();
    const now=new Date();
    const oneMonthAgo= new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDate()
    );
    const lastMonthUsers=await User.countDocuments({
      createdAt:{$gte:oneMonthAgo}
    });
    res.status(200).json({users:usersWithoutPassword, totalUsers, lastMonthUsers});
  }catch(err){
    next(err);
  }
}


export const get_user_get =async(req,res,next)=>{
  const userId=req.params.userId;
  try{
    const user=await User.findById(userId);
    if(!user){
      return next(errorhandler(404,"User not found"));
    }
    const {password,...rest}=user._doc;
    res.status(200).json(rest);
  }catch(err){
    next(err);
  }
}



export const addUser_put = async (req, res, next) => {
    const leet_user = req.query.leetuser;
    const app_user= req.query.appuser;

    try {
        const leetUser = await Leet_User.findOne({ leetUsername: leet_user });
        if (leetUser) {
            const updatedUser = await User.findByIdAndUpdate(
                app_user,
                { $addToSet: { friends: leetUser._id } }, // adds only if leetUserId is not already present
                { new: true } // returns the updated document
            );
            return res.status(200).json({
                message: "Username added successfully",
                success: true,
                data:updatedUser
            });
        } else {
            const leetcodeResponse = await fetch(`https://leetcode-express-api.vercel.app/api/dataForSubmissionStats/${leet_user}`);
            if (!leetcodeResponse.ok) {
                return next({
                    status: 500,
                    message: "Failed to fetch data from LeetCode API"
                });
            }

            const leetcodeUserData = await leetcodeResponse.json();

            if (!leetcodeUserData || !leetcodeUserData.success) {
                return next({
                    status: 500,
                    message: "Username May Not Exist...Please check again"
                });
            }

            const newUser = new Leet_User({ leetUsername: leet_user });
            await newUser.save();
            const updatedUser = await App_User.findByIdAndUpdate(
                app_user,
                { $addToSet: { friends: newUser._id } }, // adds only if leetUserId is not already present
                { new: true } // returns the updated document
            );
            return res.status(200).json({
                message: "Username added successfully",
                success: true,
                data: updatedUser
            });
        }
    } catch (err) {
        return next({
            status: 500,
            message: "Internal Server Error"
        });
    }
};




// export const addUser_put = async (req, res, next) => {
//   const leet_user = req.query.leetuser;
//   const app_user = req.query.appuser;
//   const maxRetries = 5; // Set a maximum number of retries
//   const initialDelay = 1000; // 1 second initial delay before retry

//   // Helper function for exponential backoff retry
//   async function retryRequest(fn, retries = maxRetries, delay = initialDelay) {
//       try {
//           return await fn();
//       } catch (err) {
//           if (retries > 0) {
//               console.warn(`Retrying... Attempts left: ${retries}. Error: ${err.message}`);
//               // Wait for the delay (exponential backoff)
//               await new Promise((resolve) => setTimeout(resolve, delay));
//               return retryRequest(fn, retries - 1, delay * 2); // Retry with increased delay
//           } else {
//               throw err; // If max retries reached, throw the error
//           }
//       }
//   }

//   try {
//       // Fetch user data and retry if there is an error
//       const fetchLeetCodeUser = async () => {
//           const leetcodeResponse =  await axios.get(`https://leetcode-express-api.vercel.app/api/dataForSubmissionStats/${leet_user}`);
//           if (!leetcodeResponse.ok) {
//               throw new Error("Failed to fetch data from LeetCode API");
//           }
//           const leetcodeUserData = await leetcodeResponse.json();

//           if (!leetcodeUserData || !leetcodeUserData.success) {
//               throw new Error("Username may not exist... Please check again.");
//           }
//           return leetcodeUserData;
//       };

//       // First, check if the user exists in your own database
//       const leetUser = await Leet_User.findOne({ leetUsername: leet_user });
//       if (leetUser) {
//           // If user already exists, update app_user with leetUser's id
//           const updatedUser = await User.findByIdAndUpdate(
//               app_user,
//               { $addToSet: { friends: leetUser._id } }, // Adds only if leetUserId is not already present
//               { new: true } // Returns the updated document
//           );
//           return res.status(200).json({
//               message: "Username added successfully",
//               success: true,
//               data: updatedUser
//           });
//       } else {
//           // If user does not exist, fetch the user data from LeetCode with retry logic
//           const leetcodeUserData = await retryRequest(fetchLeetCodeUser);

//           // Create a new user in your database with the fetched data
//           const newUser = new Leet_User({ leetUsername: leet_user });
//           await newUser.save();

//           // Update app_user to add the new LeetCode user as a friend
//           const updatedUser = await App_User.findByIdAndUpdate(
//               app_user,
//               { $addToSet: { friends: newUser._id } }, // Adds only if leetUserId is not already present
//               { new: true } // Returns the updated document
//           );
//           return res.status(200).json({
//               message: "Username added successfully",
//               success: true,
//               data: updatedUser
//           });
//       }
//   } catch (err) {
//       return next({
//           status: 500,
//           message: `Internal Server Error: ${err.message}`
//       });
//   }
// };
