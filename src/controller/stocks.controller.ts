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

     await Stock.create({
    name,
    price,
    size,
    color,
    images: result.secure_url,
    cloudinary_id: result.public_id
   })
   
   return res.status(200).json({msg: "stock uploaded successfully"})

    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error', error});
    }
};

export const GetAllClothes = async (req: Request, res: Response)=>{
  const seletedfileld = "name price size color images"
  const stocks = await Stock.find({deleted: false}).select(seletedfileld).lean();
  res.status(200).json({stocks}) 
}

export const GetOneStockById = async(req: Request, res: Response)=>{
  try {
  const paramid = req.params.id;
  if (!paramid) {
    return res.status(403).json({msg: `id ${paramid}`})
  }
  const seletedfileld = "name price size color images"
  const stock = await Stock.findOne({_id: paramid, deleted: false}).select(seletedfileld).lean();
  res.status(200).json({stock})
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error', error});
  }
  
}

export const DeleteStockById = async (req: Request, res: Response) => {
  try {
    const paramid = req.params.id;
    const cloth = await Stock.findById(paramid);

    if (!cloth) {
      return res.status(404).json({ msg: "Stock not found" });
    }

    try {
      await cloudinary.uploader.destroy(cloth.cloudinary_id);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
    }

    await Stock.findByIdAndDelete(paramid);
    res.json({ msg: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error', error});
  }
};