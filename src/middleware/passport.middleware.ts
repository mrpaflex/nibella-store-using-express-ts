import { NextFunction, Request, Response } from "express";

export const ensureAuth = async (req: Request, res: Response, next: NextFunction)=>{
    if (req.isAuthenticated()) {
        
        return req.user;
       //  next();
    }else{
        res.status(400).json({msg: "your are not authennticated"})
    }
}