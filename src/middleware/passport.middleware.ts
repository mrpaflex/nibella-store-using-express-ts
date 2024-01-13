import { NextFunction, Request, Response } from "express";



export const ensureAuth = async (req: Request, res: Response, next: NextFunction)=>{
    if (req.isAuthenticated()) {
      next();
      //console.log(req.user)
      return  req.user;
     
    }else{
        res.status(400).json({msg: "you need to log in first"})
    }
}



