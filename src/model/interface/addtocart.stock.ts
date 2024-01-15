import { Document } from 'mongoose';

export interface AddToCartStock extends Document {
  id: {
   type: String[],
   required: true
};

quantity: {
    type: Number,
    default: 1,
    required: true
};

size:{
    type: String,
    required: true
};

color: {
    type: String,
    required: true
}

}