//import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken')
import {config} from 'dotenv';
config()

export const GenerateAccessToken = async (userId: string)=>{
    const token =  jwt.sign(
        {userId}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.EXPIRE_TIME} ,
    )
    return token
}


export const GenerateRefreshToken = async (userId: string)=>{
    const token =  jwt.sign(
        {userId}, 
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_EXPIRE_TIME} ,
    )
    return token
}


export const VerifyJwt = async(refresh: string)=>{
    const token = jwt.verify(
        refresh,
        process.env.REFRESH_TOKEN_SECRET,
        )
        return token
}

// import jwt from 'jsonwebtoken';
// import { config } from 'dotenv';
// config();

// export const GenerateAccessToken = async (userId: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         jwt.sign(
//             { userId },
//             process.env.ACCESS_TOKEN_SECRET!,
//             { expiresIn: process.env.EXPIRE_TIME! },
//             (err, token) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(token!);
//                 }
//             }
//         );
//     });
// };
