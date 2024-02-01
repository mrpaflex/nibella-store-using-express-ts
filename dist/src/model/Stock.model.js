"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stocks_enum_1 = require("../enum/stocks.enum");
const StockSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [Object],
        required: true,
    },
    stockType: {
        required: true,
        type: String,
        enum: Object.values(stocks_enum_1.StockTypes),
    },
    userid: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    },
    cloudinary_id: {
        type: String,
        required: true
    },
    outofstock: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    date: {
        default: Date.now,
        type: Date
    }
});
exports.Stock = mongoose_1.default.model('stock', StockSchema);
