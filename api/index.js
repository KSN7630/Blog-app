import express from 'express'
const app=express();
import  mongoose from 'mongoose';
import 'dotenv/config'


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