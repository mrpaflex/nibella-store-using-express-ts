import { NextFunction, Request, Response } from "express";
import {User} from '../model/User.model';
import { validationResult } from 'express-validator';
import { hashedPassword } from "../common/hashedPassword";
import passport from "passport";

// export const SignUp = async (req: Request, res: Response)=>{

//    const errors = validationResult(req)

//     if (!errors.isEmpty()) {
//     let errorArray = errors.array();
//     return res.status(400).json({msg: errorArray[0].msg})
//    }

//    try {
//     const {fullName, email, gender,  password, userName, telephone, address} = req.body;

//     if (!fullName || !email || !userName || !telephone) {
//         return res.status(400).json({msg: 'all filed are required'})
//     }

//     const user = await User.findOne({
//         $or:[{ email: email},{userName: userName}]
//     });

//     if(user){
//        return res.status(400).json({msg: 'user with same credentials already exist'})
//     }

//     const hashedPassw = await hashedPassword(password);

//     const createUser = await User.create({
//         fullName: fullName,
//         email: email,
//         password: hashedPassw,
//         gender: gender,
//         userName: userName,
//         telephone: telephone,
//         address: address
//     });

//     res.json({createUser});

//    } catch (error) {
//    return res.status(400).json({msg: 'server error while signing up', error})
//    }
// };

export const SignUp = async (req: Request, res: Response) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      let errorArray = errors.array();
      return res.status(400).json({ msg: errorArray[0].msg });
    }
  
    try {
      const { fullName, email, gender, password, userName, telephone, address } = req.body;
  
      const requiredFields = ['fullName', 'email', 'userName', 'telephone'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ msg: `${field} is required` });
        }
      }
  
      const user = await User.findOne({
        $or: [{ email: email }, { userName: userName }],
      });
  
      if (user) {
        return res.status(400).json({ msg: 'User with the same credentials already exists' });
      }
  
      const hashedPassw = await hashedPassword(password);
  
      const createUser = await User.create({
        fullName: fullName,
        email: email,
        password: hashedPassw,
        gender: gender,
        userName: userName,
        telephone: telephone,
        address: address,
      });
  
      res.json({ createUser });
    } catch (error) {
      return res.status(400).json({ msg: 'Server error while signing up', error });
    }
  };
  

// export const LogInUser= async (req: Request, res: Response, next: NextFunction)=>{
//     passport.authenticate('local', async (err: any, user: any)=>{
//         try {
//           if (err) {
//             res.status(400).json({msg: err})
//             next()
//           }
//           if (!user) {
//             return res.status(400).json({msg: "user does not exit"})
//           }

//          req.logIn(user, (err) =>{
//             if (err) {
//                res.status(400).json({msg: err}) 
//             }
//             return user
//         })
//         } catch (error) {
//             throw error;
//         }
//     })
// }

export const LogInUser = (req: Request, res: Response, next: NextFunction) => {
   
    passport.authenticate('local', async (err: any, user: string, info: any) => {
      try {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        if (!user) {
          return res.status(400).json({ msg: 'User does not exist' });
        }
  
        req.logIn(user, (err) => {
          if (err) {
            return res.status(400).json({ msg: err });
          }
  
         console.log('Login successful');
          return res.json({ msg: 'Login successful', user });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
  