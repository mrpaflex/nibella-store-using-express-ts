import mongoose from 'mongoose';

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
 
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    cloudinary_id: {
        type: String,
        required: true
    },
    images:{
         type: [Object],
        required: true,
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