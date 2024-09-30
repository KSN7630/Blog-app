import express from 'express'

import  mongoose from 'mongoose';
import 'dotenv/config'
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"


const app=express();
app.use(express.json());  // need to enalble so that json as the input for backend

mongoose.connect(process.env.MONGO_URL).then(
    ()=>{
        console.log("Mongodb connected");
    })
    .catch(
        (err)=>{
            console.log(err);
        }
    )
app.listen(3000,()=>{
    console.log("Server is running at port 3000");
})


//use app.use as it is middleware
app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)


//typical format of erro handler -- read it from express-mdn
//4 para --> err,req,res,next
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message =err.message || "Internal server Error";
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
})