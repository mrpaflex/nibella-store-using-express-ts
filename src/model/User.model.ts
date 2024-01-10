import mongoose from 'mongoose';
import { UserType } from './enum/user.enum';

const USerSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
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
    date:{
        default: Date.now,
        type: Date

    }

})

module.exports = mongoose.model('user', USerSchema)
