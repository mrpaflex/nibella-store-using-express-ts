import {Request, Response } from "express";
import {Stock} from '../model/Stock.model';
import  { Session } from 'express-session';
import {cloudinary} from '../common/cloudinary/cloudinary.config';
import mongoose from "mongoose";
import { IUser } from "../model/User.model";


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
  let user = (req.user as IUser);
  

  interface CustomSession extends Session {
   // user?: {_id: string; userName: string};
    passport?: { user: string };
    cart?: { id: string; quantity: number; size?: string; color?: string }[];
  }

  const { items }: { items: { id: string; quantity: number; size?: string; color?: string }[] } = req.body;

  const requiredFields = ['id', 'size', 'color'];

  for (const field of requiredFields) {
    if (!items.every((item: any) => item[field])) {
      return res.status(400).json({ msg: `${field} must be selected for each item` });
    }
  }

  try {
    const customSession = req.session as CustomSession;

    if (!user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    let cart: { id: string; quantity: number; size?: string; color?: string }[] = []

    for (const item of items) {
      const stock = await Stock.findOne({ _id: item.id });

      if (!stock?._id) {
        return res.status(404).json({ msg: `Product with ID ${item.id} not found` });
      }

      if (stock?.outofstock === true) {
        return res.status(404).json({ msg: `Selected product ${stock._id} out of stock` });
      }

      cart.push({
        id: stock._id.toString(),
        quantity: item.quantity || 1,
        size: item.size,
        color: item.color,
      });
    }

    if (!cart || cart.length === 0) {
      return res.status(405).json({ msg: "Your cart is empty" });
    }

    customSession.cart = cart;

    res.status(200).json({ message: 'Products added to cart', cart });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};


export const OrderPage = async (req: Request, res: Response)=>{
 let user = (req.user as IUser);

  interface CustomSession extends Session {
   // user?: {_id: string; userName: string};
   passport?: { user: string };
   cart?: { id: string; quantity: number; size?: string; color?: string }[];
  }

  const customSession = req.session as CustomSession;
  const cartItems = customSession;
  try {

    if (!user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

   

    if (!cartItems.passport) {
      return res.status(403).json({msg: "can not proceed"})
    }

    if (user._id.toString() !== cartItems.passport.user.toString()) {
      console.log(user._id.toString(), cartItems.passport.user.toString())
      return res.status(401).json({ msg: 'id not same, can not proceed ' });
    }
  
    return res.status(201).json({msg: cartItems.cart})
  // res.send(`items selected for purchase, ${cartItems}`);
  // res.render('orderPageHtml', {cart: cartItems})//this is when sending it to the frontend
  } catch (error) {
    
  }
}
