import {Request, Response } from "express";
import {IStock, Stock} from '../model/Stock.model';
import {cloudinary} from '../common/cloudinary/cloudinary.config';
import { AddToCartStock } from "../model/interface/addtocart.stock";

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

export const AddToCart = async (req: Request, res: Response) => {
  
  const { id, quantity, size, color }: AddToCartStock = req.body;

  
  const requiredFields = [ 'id', 'size', 'color'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ msg: `${field} must be selected` });
    }
  }
  
  let cart: { id: string; quantity: any; size: any; color: any}[] = [];
  try {
   // const stockId = (req.user as IStock)._id.toString()
    const stocks = await Stock.find({
      _id: { $in: id },
      outofstock: false,
    });

    if (!stocks || stocks.length === 0) {
      return res.status(404).json({ msg: "Product IDs not found or out of stock" });
    }
    stocks.forEach((stock) => {
      cart.push({ id: stock._id.toString(), quantity: quantity || 1, size: size, color:color });
    });
    if (!cart || cart.length === 0) {
      return res.status(405).json({ msg: "Your cart is empty" });
    }

    res.status(200).json({ message: 'Products added to cart', cart });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error});
  }
};
