import { Request, Response } from "express";
   export const homePage = async (req: Request, res: Response)=>{
        return res.send('welcome buddy, please use me i am your api');
    }
