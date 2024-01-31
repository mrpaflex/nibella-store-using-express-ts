 import mongoose from 'mongoose';
 import * as dotenv from "dotenv";
 dotenv.config()
 
export const connectDB = async ()=>{
   try {
      const DB_UR = process.env.MONGO_URI;
      if (!DB_UR) {
         throw new Error('db url not found')
      }
      await mongoose.connect(DB_UR);
      console.log('connected to database successfully')
   } catch (error) {
    throw new Error('server error')
   }
}