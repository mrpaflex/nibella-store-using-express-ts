import {Request, Response } from "express";
import {Stock} from '../model/Stock.model';
import {ITransaction, Transaction} from '../model/Transaction.model'
import  { Session } from 'express-session';
import {cloudinary} from '../common/cloudinary/cloudinary.config';
import { IUser } from "../model/User.model";
import * as https from 'https';
import * as dotenv from "dotenv";
import { StockTypes } from "../enum/stocks.enum";
//import { Request, Response } from 'express-serve-static-core'
dotenv.config()
// console.log(https)

export const UploadStock = async (req: Request, res: Response)=>{
  
    try {
    const {name, price, stockType} = req.body;
    const requiredFields = ['name', 'price', 'stockType'];
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
    stockType,
    images: result.secure_url,
    cloudinary_id: result.public_id
   })
   
   return res.status(200).json({msg: "stock uploaded successfully"})

    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error', error});
    }
};

export const GetAllClothes = async (req: Request, res: Response)=>{ 
try {
  const resPerPage = 20;
  const currentPage = Number(req.query.page); 
  const skip = resPerPage * (currentPage - 1);

  const seletedfileld = "name price images"
  const stocks = await Stock.find({deleted: false}).select(seletedfileld).limit(resPerPage).skip(skip).lean()
  res.status(200).json({stocks}) 
} catch (error) {
  res.status(500).json({ msg: 'Internal Server Error', error });
}
}

export const GetOnlyMenWears = async (req: Request, res: Response)=>{ 
  try {
    const resPerPage = 20;
    const currentPage = Number(req.query.page); 
    const skip = resPerPage * (currentPage - 1);
  
    const seletedfileld = "name price images"
    const stocks = await Stock.find({
      stockType: StockTypes.MEN_CLOTHES,
      deleted: false
    }).select(seletedfileld).limit(resPerPage).skip(skip).lean()
    res.status(200).json({stocks}) 
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
  }

  export const GetOnlyWomenWear = async (req: Request, res: Response)=>{ 
    try {
      const resPerPage = 20;
      const currentPage = Number(req.query.page); 
      const skip = resPerPage * (currentPage - 1);
    
      const seletedfileld = "name price images"
      const stocks = await Stock.find({
        stockType: StockTypes.WOMEN_CLOTHES,
        deleted: false
      }).select(seletedfileld).limit(resPerPage).skip(skip).lean()
      res.status(200).json({stocks}) 
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error', error });
    }
    }

    //from here set
    export const GetOnlyHairs = async (req: Request, res: Response)=>{ 
      try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page); 
        const skip = resPerPage * (currentPage - 1);
      
        const seletedfileld = "name price images"
        const stocks = await Stock.find({
          stockType: StockTypes.HAIR,
          deleted: false
        }).select(seletedfileld).limit(resPerPage).skip(skip).lean()
        res.status(200).json({stocks}) 
      } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
      }
      }

      export const GetOnlyComestics = async (req: Request, res: Response)=>{ 
        try {
          const resPerPage = 20;
          const currentPage = Number(req.query.page); 
          const skip = resPerPage * (currentPage - 1);
        
          const seletedfileld = "name price images"
          const stocks = await Stock.find({
            stockType: StockTypes.COMESTICS,
            deleted: false
          }).select(seletedfileld).limit(resPerPage).skip(skip).lean()
          res.status(200).json({stocks}) 
        } catch (error) {
          res.status(500).json({ msg: 'Internal Server Error', error });
        }
        }
 export const GetOnlyShoes = async (req: Request, res: Response)=>{ 
          try {
            const resPerPage = 20;
            const currentPage = Number(req.query.page); 
            const skip = resPerPage * (currentPage - 1);
          
            const seletedfileld = "name price images"
            const stocks = await Stock.find({
              stockType: StockTypes.SHOES,
              deleted: false
            }).select(seletedfileld).limit(resPerPage).skip(skip).lean()
            res.status(200).json({stocks}) 
          } catch (error) {
            res.status(500).json({ msg: 'Internal Server Error', error });
          }
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


export const FindStocksByName = async (req: Request, res: Response) => {
  const resPerPage = 6;
  const currentPage = Number(req.query.page); 
  const skip = resPerPage * (currentPage - 1);
  try {
    const stockname = req.params.name;

    const regex = new RegExp(stockname, 'i');

    const selectedFields = "name price images"; 
    const stock = await Stock.find({ name: regex, deleted: false }).select(selectedFields).limit(resPerPage).skip(skip).lean()

    if (!stock || stock.length === 0) { 
      return res.status(404).json({ msg: `Stock with name '${stockname}' not found` });
    }
    res.status(200).json({ stock });
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error', error });
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
 let user = req.user as IUser;

 const productId = req.params.id;
 //remove this later
 console.log('i am param product id', productId)

  interface CustomSession extends Session {
   // user?: {_id: string; userName: string};
    passport?: { user: string };
    
    cart?: { id: string; quantity: number; size?: string; color?: string}[];
  }

  const { items }: { items: { quantity: number; size?: string; color?: string} [] } = req.body;

  const requiredFields = ['size', 'color'];


  try {
    const customSession = req.session as CustomSession;

    if (!user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    let cart: { id: string; quantity: number; size: any; color: any, price: number }[] = []

    for (const item of items) {
      const stock = await Stock.findOne({ _id: productId });

      for (const field of requiredFields) {
        if (!items.every((item: any) => item[field])) {
          return res.status(400).json({ msg: `${field} must be selected for each item` });
        }
      }
    

      //remove this later
      console.log('i am stock', stock)

      if (!stock?._id) {

        //remove this later
        console.log(`stock with id ${stock?._id} not found`)

        return res.status(404).json({ msg: `Product with ID ${productId} not found` });
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

    if (!cart || cart.length === 0) {
      return res.status(405).json({ msg: "Your cart is empty" });
    }

    customSession.cart = cart;
    res.status(200).json({ message: 'Products added to cart', cart });

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Internal server error", error });
  }
};


export const CheckoutOrder = async (req: Request, res: Response)=>{

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
    if (!cartItems.passport || !cartItems.cart) {
      return res.status(403).json({msg: "Cart is empty or not found"})
    }

    if (user._id.toString() !== cartItems.passport.user.toString()) {
      console.log(user._id.toString(), cartItems.passport.user.toString())
      return res.status(401).json({ msg: "User ID does not match, cannot proceed" });
    }
  
   
    let totalCartPrice = 0;

    if (cartItems.cart && cartItems.cart.length > 0) {
      for (const item of cartItems.cart) {
        totalCartPrice += item.price * item.quantity;
      }
    }

    return res.status(201).json({cart: cartItems.cart, totalCartPrice: totalCartPrice})

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Internal server error", error });
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
     if (!cartItems.passport || !cartItems.cart) {
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
   "amount": totalCartPrice * 100,
   "stock": cartItems.cart
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
    
    console.log(data)

     res.status(200).json({data})
     
   })

 }).on('error', error => {
   console.error('error', error)
 })
 
 reqParam.write(params)
 reqParam.end()


   } catch (error) {
     console.log(error);
     res.status(500).json({msg: "server error occur"})
   }
   

 };


//this endpoint will automatically run when the payment is made from the frontend
export const VerifyPayment = async (req: Request, res: Response) => {
  const user = req.user as IUser

  const referId = req.params.referenceId;

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${referId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SRCRET}`,
      'Content-Type': 'application/json'
    }
  };

  const request = https.request(options, resParam => {
    let data = '';

    resParam.on('data', (chunk) => {
      data += chunk;
    });

    resParam.on('end', async () => {
      try {
        const responseData = JSON.parse(data);

        if (responseData.status) {
       const amount=  responseData.data.amount / 100;

       await Transaction.create({
        userId: user._id,
        amount: amount,
        //stockId: '',
        channel: responseData.data.channel,
        currency: responseData.data.currency,
        txnReferenceId: responseData.data.reference,
        transactionStatus: responseData.data.status,
        transaction_created_at: responseData.data.created_at,
        paidAt: responseData.data.paidAt,
        customerEmail: responseData.data.customer.email,
        customer_name: user.fullName

       })


         //console.log(responseData);

          res.status(200).json(responseData );
        } else {
          res.status(400).json({ msg: 'Payment verification failed', details: responseData.message });
        }
      } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Internal server error', error });
      }
    });
  });

  request.on('error', error => {
    res.status(500).json({ msg: 'Internal server error', error });
  });

  request.end(); // Ensure to end the request
};
