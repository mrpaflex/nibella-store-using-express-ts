import mongoose, { Document } from 'mongoose';


export interface IStock extends Document {
    _id: mongoose.Types.ObjectId;
    name: string,
    price: number,
    size: string,
    color: string,
    images: [object],
    userid: mongoose.Schema.Types.ObjectId,
    cloudinary_id: Boolean,
    outofstock: Boolean,
    deleted: Boolean
    date: Date
  }


const StockSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    price:{
        type: Number,
        required: true
    },

    size:{
        type: String,
        required: true
    },
 
    color:{
        type: String,
        required: true
    },
 
    images:{
        type: [Object],
        required: true,
    },
    
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    cloudinary_id: {
        type: String,
        required: true
    },
    

    outofstock:{
        type: Boolean,
        default: false,
    },

    deleted:{
        type: Boolean,
        default: false,
    },

    date:{
        default: Date.now,
        type: Date

    }

})


export  const Stock = mongoose.model('stock', StockSchema);