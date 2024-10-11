import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const timeSeriesSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    data:{
        easy:{
            type: Number
        },
        medium: {
            type: Number
        },
        hard: {
            type: Number
        }
    },
    solved:{
        easy:{
            type: Number
        },
        medium: {
            type: Number
        },
        hard: {
            type: Number
        }
    } 
  });
  

const Leet_UserSchema = new Schema({
    leetUsername: {
        type: String,
        required: true,
        unique: true
      },
    timeSeriesData: [timeSeriesSchema]
    
  });


  export const Leet_User = mongoose.model('Leet_User',Leet_UserSchema);