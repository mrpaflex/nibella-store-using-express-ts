import mongoose from 'mongoose';
import { GenderType, UserType } from './enum/user.enum';

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
    userType:{
        type: String,
        enum: Object.values(UserType),
        default: UserType.CUSTOMER,
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


export  const User = mongoose.model('User', UserSchema);

//export default User;