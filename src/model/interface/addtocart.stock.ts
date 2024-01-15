import { Document } from 'mongoose';

export interface AddToCartStock extends Document {
id: [string];
quantity: any;

size: any;
color: any

// size:{
//     type: String,
//     required: true
// };

// color: {
//     type: String,
//     required: true
// }

}