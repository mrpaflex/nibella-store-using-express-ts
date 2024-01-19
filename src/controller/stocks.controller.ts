import {Request, Response } from "express";
import {Stock} from '../model/Stock.model';
import  { Session } from 'express-session';
import {cloudinary} from '../common/cloudinary/cloudinary.config';
import { IUser } from "../model/User.model";
import * as https from 'https';
import * as dotenv from "dotenv";
dotenv.config()
// console.log(https)

export const UploadStock = async (req: Request, res: Response)=>{
  
    try {
    const {name, price} = req.body;
    const requiredFields = ['name', 'price'];
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
    images: result.secure_url,
    cloudinary_id: result.public_id
   })
   
   return res.status(200).json({msg: "stock uploaded successfully"})

    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error', error});
    }
};

export const GetAllClothes = async (req: Request, res: Response)=>{
  const seletedfileld = "name price images"
  const stocks = await Stock.find({deleted: false}).select(seletedfileld).lean();
  res.status(200).json({stocks}) 
}

export const GetOneStockById = async(req: Request, res: Response)=>{
  try {
  const paramid = req.params.id;
  const seletedfileld = "name price images"
  const stock = await Stock.findOne({_id: paramid, deleted: false}).select(seletedfileld).lean();
  if (!stock) {
    return res.status(404).json({msg: `id ${paramid} not found`})
  }
  res.status(200).json({stock});
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
    cart?: { id: string; quantity: number; size?: string; color?: string}[];
  }

  const { items }: { items: { id: string; quantity: number; size?: string; color?: string}[] } = req.body;

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

    let cart: { id: string; quantity: number; size?: string; color?: string, price: number }[] = []

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
        price: stock.price,
        quantity: item.quantity || 1,
        size: item.size,
        color: item.color,
      });
    };

    // let totalCartPrice = 0;

    // for (const item of cart) {
    //   totalCartPrice += item.price * item.quantity;
    // }


    if (!cart || cart.length === 0) {
      return res.status(405).json({ msg: "Your cart is empty" });
    }

    customSession.cart = cart;
    res.status(200).json({ message: 'Products added to cart', cart });

  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};


export const ConfirmedOrder = async (req: Request, res: Response)=>{
 let user = (req.user as IUser);

  interface CustomSession extends Session {
   passport?: { user: string };
   cart?: { id: string; quantity: number; size?: string; color?: string, price: number }[];
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
  
   
    let totalCartPrice = 0;

    if (cartItems.cart && cartItems.cart.length > 0) {
      for (const item of cartItems.cart) {
        totalCartPrice += item.price * item.quantity;
      }
    }

    return res.status(201).json({msg: cartItems.cart, totalCartPrice})

  // res.send(`items selected for purchase, ${cartItems}`);
  // res.render('orderPageHtml', {cart: cartItems})//this is when sending it to the frontend
  } catch (error) {
    
  }
}


export const StocksPayment = async (req: Request, res: Response)=>{
  let user = (req.user as IUser);
 
   interface CustomSession extends Session {
    passport?: { user: string };
    cart?: { id: string; quantity: number; size?: string; color?: string, price: number }[];
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
   
    
     let totalCartPrice = 0;
 
     if (cartItems.cart && cartItems.cart.length > 0) {
       for (const item of cartItems.cart) {
         totalCartPrice += item.price * item.quantity;
       }
     }
 
 const params = JSON.stringify({
   "email": user.email,
   "amount": totalCartPrice * 100
 })
 
 const options = {
   hostname: 'api.paystack.co',
   port: 443,
   path: '/transaction/initialize',
   method: 'POST',
   headers: {
     Authorization: `Bearer ${process.env.PAYSTACK_SRCRET}`,
     'Content-Type': 'application/json'
   }
 }
 
 const reqParam = https.request(options, reqParam => {
   let data= '';
 
   reqParam.on('data', (chunk) => {
     data += chunk
   });
 
   reqParam.on('end', () => {
     res.status(200).json({msg: data})
     console.log(data)
   })
 }).on('error', error => {
   console.error(error)
 })
 
 reqParam.write(params)
 reqParam.end()
 
   } catch (error) {
     
   }
 };

//  export const VerifyPayment = async (req: Request, res: Response)=>{
//   const referId = req.params.referenceId;
// const options = {
//   hostname: 'api.paystack.co',
//   port: 443,
//   path: `/transaction/verify/:${referId}`,
//   method: 'GET',
//   headers: {
//     Authorization: `Bearer ${process.env.PAYSTACK_SRCRET}`
//   }
// }

// https.request(options, resParam => {
//   let data = ''

//   resParam.on('data', (chunk) => {
//     data += chunk
//   });

//   resParam.on('end', () => { 
//     console.log(JSON.parse(data))
//     res.status(200).json({msg: data})
//   })

 
// }).on('error', error => {
//   console.error(error)
// })
//  }

// export const VerifyPayment = async (req: Request, res: Response) => {
//   const referId = req.params.referenceId;
//   const options = {
//     hostname: 'api.paystack.co',
//     port: 443,
//     path: `/transaction/verify/${referId}`, 
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
//     }
//   };

//   https.request(options, resParam => {
//     let data = '';

//     resParam.on('data', (chunk) => {
//       data += chunk;
//     });

//     resParam.on('end', () => {
//       const responseData = JSON.parse(data);
//       res.status(200).json({ msg: responseData });
//     });
//   }).on('error', error => {
//     res.status(500).json({ msg: 'Internal server error' });
//   }).end(); // Ensure to end the request

//   // Note: The response will be sent inside the 'end' event handler
// };

export const VerifyPayment = async (req: Request, res: Response) => {
  const referId = req.params.referenceId;

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${referId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
    }
  };

  const request = https.request(options, resParam => {
    let data = '';

    resParam.on('data', (chunk) => {
      data += chunk;
    });

    resParam.on('end', () => {
      console.log(data);
      try {
        const responseData = JSON.parse(data);
        // console.log(responseData);

        if (responseData.status) {
          res.status(200).json({ msg: responseData });
        } else {
          res.status(400).json({ msg: 'Payment verification failed', details: responseData.message });
        }
      } catch (error) {
        console.error('Error parsing Paystack response:', error);
        res.status(500).json({ msg: 'Internal server error' });
      }
    });
  });

  request.on('error', error => {
    console.error('Paystack request error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  });

  request.end(); // Ensure to end the request
};
