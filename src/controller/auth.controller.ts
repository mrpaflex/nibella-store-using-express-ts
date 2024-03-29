import { NextFunction, Request, Response } from "express";
import {IUser, User} from '../model/User.model';
import { validationResult } from 'express-validator';
import { comparedPassword, hashedPassword } from "../common/hashedPassword";
import passport from "passport";
import { IUserUpdate } from "../model/interface/updateUser";



// import { ExludeField } from "../model/exclude/excludefield.user";
// import { UpdateUserInfo } from "../model/dto/updateUser";


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
      }).lean();
  
      if (user) {
        if (user.email === email && user.userName === userName) {
          return res.status(400).json({ msg: 'User with the same email and username already exists' });
        }

        if (user.email === email) {
          return res.status(400).json({ msg: 'User with the same email already exists' });
        }
        
        if (user.userName === userName) {
          return res.status(400).json({ msg: 'User with the same Username already exists' });
        }
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
  console.log(`you have sign up sucessfully ${createUser.userName}`)
      return res.status(201).json({ 
        Respone: `you have successfully sign up ${createUser.fullName}`
       });
    } catch (error) {
      return res.status(400).json({ msg: 'Server error while signing up', error });
    }
  };

export const LogInUser = (req: Request, res: Response, next: NextFunction) => {
   
    passport.authenticate('local', async (err: any, user: IUser, done: any) => {
      try {
        if (err) {
          return res.status(400).json({ msg: err });
        }
        if (done) {
          if (done.message === "1") {
            return res.status(400).json({ msg: 'user does not exist' });
          }
          if (done.message === "2") {
            return res.status(400).json({ msg: 'password do not matched' });
          }         
        }
        req.logIn(user, async (err) => {
          if (err) {
            next(err)
          }
          
          console.log(`you just log in  ${user?.userName}`);

       return res.status(200).json({ msg: `logged in successfully` });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };


export const FindOneUser = async (req: Request, res: Response)=>{
    try {
    const userId = req.params.id
    const seletedfileld = "fullName userName telephone email"
    const user = await User.findById(userId).select(seletedfileld).lean()
    if (!user) {
      return res.status(405).json({msg: 'user not found'})
    }

    return res.status(200).json({user: user})
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const FindAllUser = async (req: Request, res: Response)=>{
    try {
      const seletedfileld = "fullName userName telephone email"
    const user = await User.find().select(seletedfileld).lean();
    return res.status(200).json({user: user})
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export const SuspendUser = async (req: Request, res: Response) => {
    try {
      const paramid = req.params.id;
      const user = await User.findOne({ _id: paramid });
  
      if (!user) {
        return res.status(404).json({ msg: `User with id ${paramid} not found` });
      }
  
      if (user.suspended === true) {
        return res.status(402).json({ msg: `User ${user.fullName} has already been suspended` });
      }
  
      await User.findOneAndUpdate(
        { _id: paramid },
        { $set: { suspended: true } },
        { new: true, runValidators: true }
      ).lean();
  
      return res.json({ msg: `User with id ${paramid} suspended successfully`});
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const UnSuspendUser = async (req: Request, res: Response) => {
    try {
      const paramid = req.params.id;
      const user = await User.findOne({ _id: paramid });
  
      if (!user) {
        return res.status(404).json({ msg: `User with id ${paramid} not found` });
      }
  
      if (user.suspended === false) {
        return res.status(402).json({ msg: `User ${user.fullName} was not suspended` });
      }
  
      await User.findOneAndUpdate(
        { _id: paramid },
        { $set: { suspended: false } },
        { new: true, runValidators: true }
      ).lean();
  
      return res.json({ msg: `User with id ${paramid} is not longer suspended`});
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const EditProfile = async (req: Request, res: Response) => {
  try {
    const paramid = req.params.id;
    
    const UpdateUserInfo: IUserUpdate = req.body;

    const requiredFields = Object.keys(UpdateUserInfo);

    if (requiredFields.length === 0) {
      return res.status(405).json({ msg: "At least one field is required" });
    }

    const user = await User.findById(paramid);

    if (!user) {
      return res.status(404).json({ msg: `User with id ${paramid} not found` });
    }

    if (user._id.toString() !== (req.user as IUser)._id.toString()) {

      //console.log(user._id.toString(), (req.user as IUser)._id.toString() )

      return res.status(403).json({ msg: "You can only update your profile" });
    }

    await User.findByIdAndUpdate(
      paramid,
      UpdateUserInfo,
      { new: true, runValidators: true }
    ).lean();

    return res.json({ msg: `Profile updated successfully` });
  } catch (error) {
    return res.status(500).json({ msg: 'Internal Server Error', error });
  }
};


export const LogoutUser = async (req: Request, res: Response) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out', error: err });
    }

    if (req.session) {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ message: 'Failed to destroy session', error: destroyErr });
        }
        clearCookieAndRespond(res);
      });
    } else {
      clearCookieAndRespond(res);
    }
  });
};

function clearCookieAndRespond(res: Response) {
  res.clearCookie('cookie');
  return res.status(200).json({ message: 'Logout successful' });
}

export const DeleteUser = async (req: Request, res: Response) => {
  const username = req.params.username;

  try {
    const deletedUser = await User.findOneAndDelete({ userName: username });

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.status(200).json({ msg: 'User deleted successfully'});

  } catch (error) {
    return res.status(500).json({ msg: 'Server error while deleting user' });
  }
};


