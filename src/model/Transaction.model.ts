import mongoose, { Schema } from "mongoose";


export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
   // stockId?: mongoose.Types.ObjectId[];
    customerEmail: string;
    customer_name?: string; 
    amount: number;
    channel: string;
    currency: string;
    txnReferenceId: string;
    transactionStatus?: string; 
    transaction_created_at?: Date; 
    date: Date;
    paidAt?: Date; 
}

 const TransactionSchema: Schema<ITransaction> = new mongoose.Schema({
   
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    // stockId:{
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'stock',
    // },

    customerEmail:{
        type: String,
        required: true
    },

    customer_name:{

    },

    amount:{
        type: Number,
        required: true
    },

    channel: {
        type: String,
        required: true
    },

    currency: {
        type: String,
        required: true
    },

 

    txnReferenceId:{
        type: String,
        required: true
    },

    transactionStatus:{
        type: String
    },

    transaction_created_at:{
        type: Date
    },

    date:{
        default: Date.now(),
        type: Date
    },

    paidAt: {
        type: Date
    }

})

//export const Transaction = mongoose.model('Transaction', TransactionSchema); 
export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);