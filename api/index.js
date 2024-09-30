import express from 'express'
const app=express();
import  mongoose from 'mongoose';
import 'dotenv/config'
import userRoute from "./routes/user.route.js"

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