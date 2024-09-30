import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const test_get=(req,res)=>{
    res.send("This is test request");
}


export const signup_post=async(req,res)=>{
    const {username ,email,password}= req.body;
    if(!username || !email || !password || username==='' || password==='' || username===''){
        return res.status(400).json({message:"All fields are required"});
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
        res.status(200).json(savedUser);
    }catch(err){
        res.status(500).json({message:err.message});
    }
    
}