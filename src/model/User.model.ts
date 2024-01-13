import mongoose, { Document } from 'mongoose';
import { GenderType, UserType } from '../enum/user.enum';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    userName: string;
    telephone: string;
    password: string;
    userRole: string[];
    gender: string;
    suspended: boolean;
    address: string | null;
    date: Date;
  }

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },

    userName:{
        type: String,
        required: true,
        unique: true
    },
    
    telephone:{
        type: String,
        required: true
    },
    password: {
        required: true,
        type: String
    },
    userRole:{
        type: [String],
        required: true,
        enum: Object.values(UserType),
        default: [UserType.CUSTOMER],
    },

    gender:{
        type: String,
        enum: Object.values(GenderType),
        default: GenderType.FEMALE,
  
    },

    suspended:{
        type: Boolean,
        default: false,
    },

    address:{
        type: String,
        default: null
    },
    date:{
        default: Date.now,
        type: Date

    }

})


  const User = mongoose.model<IUser>('User', UserSchema);

  export { User };