import { Request, Response, NextFunction } from 'express';
import { IUser } from '../model/User.model';

export const restrict = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = (req.user as IUser)?.userRole; 
  
    if (!userRoles || !userRoles.some((role: string) => allowedRoles.includes(role))) {
      return res.status(403).json({ msg: 'You are not allowed to access this route' });
    }

    return next();
  };
};

