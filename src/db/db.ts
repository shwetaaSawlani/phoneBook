import { Request, Response } from "express";
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI as string}/${DB_NAME}`)
       console.log(`\nMongoDB connected !! DB HOST :${connectionInstance.connection.host}`);
    } catch(error){
        console.log("MONDODB connection failed", error);
        process.exit(1)
    }
}

export default connectDB