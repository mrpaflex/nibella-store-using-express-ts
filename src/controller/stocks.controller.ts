import {Request, Response } from "express";
import {Stock} from '../model/Stock.model';

export const UploadStock = async (req: Request, res: Response)=>{
   
    try {
    const {name, price, size, color} = req.body;

    const requiredFields = ['name', 'price', 'size', 'color'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ msg: `${field} is required` });
      }
    }

    const stock = await Stock.create({
    name,
    price,
    size,
    color
   })
   
   return res.json({stock});

    } catch (error) {
       return res.status(400).json({msg: error}) 
    }
}