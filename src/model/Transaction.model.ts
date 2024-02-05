import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
   
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },

    stockId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stock',
        default: null
    },

    txnReferenceId:{
        type: String,
        default: null
    },

    transactionStatus:{
        type: Boolean
    },

    date:{
        default: Date.now,
        type: Date
    }

})

export const Transaction = mongoose.model('Transaction', TransactionSchema); 