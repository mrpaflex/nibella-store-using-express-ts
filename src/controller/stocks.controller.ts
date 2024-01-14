import {Request, Response } from "express";
import {Stock} from '../model/Stock.model';
import {cloudinary} from '../common/cloudinary/cloudinary.config';


export const UploadStock = async (req: Request, res: Response)=>{
  
    try {
    const {name, price, size, color} = req.body;
    const requiredFields = ['name', 'price', 'size', 'color'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ msg: `${field} is required` });
      }
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'File is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const stock = await Stock.create({
    name,
    price,
    size,
    color,
    images: result.secure_url,
    cloudinary_id: result.public_id
   })
   
   return res.status(200).json({msg: "stock uploaded successfully"})

    } catch (error) {
       return res.status(400).json({msg: error}) 
    }
}