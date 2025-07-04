import mongoose from "mongoose";
import {ENV} from './env.js';

export const connectDB = async ()=>{
    try {
       await mongoose.connect(ENV.MONGO_URI)
       console.log("connected successfully");
       
        
    } catch (error) {
       console.log("error conneting  mongodb");
        process.exit(1)
    }
}