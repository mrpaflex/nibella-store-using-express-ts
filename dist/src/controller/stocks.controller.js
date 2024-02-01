"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPayment = exports.StocksPayment = exports.ConfirmedOrder = exports.AddToCart = exports.DeleteStockById = exports.FindStocksByName = exports.GetOneStockById = exports.GetOnlyShoes = exports.GetOnlyComestics = exports.GetOnlyHairs = exports.GetOnlyWomenWear = exports.GetOnlyMenWears = exports.GetAllClothes = exports.UploadStock = void 0;
const Stock_model_1 = require("../model/Stock.model");
const cloudinary_config_1 = require("../common/cloudinary/cloudinary.config");
const https = __importStar(require("https"));
const dotenv = __importStar(require("dotenv"));
const stocks_enum_1 = require("../enum/stocks.enum");
//import { Request, Response } from 'express-serve-static-core'
dotenv.config();
// console.log(https)
const UploadStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, stockType } = req.body;
        const requiredFields = ['name', 'price', 'stockType'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ msg: `${field} is required` });
            }
        }
        if (!req.file) {
            return res.status(400).json({ msg: 'File is required' });
        }
        const result = yield cloudinary_config_1.cloudinary.uploader.upload(req.file.path);
        yield Stock_model_1.Stock.create({
            name,
            price,
            stockType,
            images: result.secure_url,
            cloudinary_id: result.public_id
        });
        return res.status(200).json({ msg: "stock uploaded successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.UploadStock = UploadStock;
const GetAllClothes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page);
        const skip = resPerPage * (currentPage - 1);
        const seletedfileld = "name price images";
        const stocks = yield Stock_model_1.Stock.find({ deleted: false }).select(seletedfileld).limit(resPerPage).skip(skip).lean();
        res.status(200).json({ stocks });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetAllClothes = GetAllClothes;
const GetOnlyMenWears = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page);
        const skip = resPerPage * (currentPage - 1);
        const seletedfileld = "name price images";
        const stocks = yield Stock_model_1.Stock.find({
            stockType: stocks_enum_1.StockTypes.MEN_CLOTHES,
            deleted: false
        }).select(seletedfileld).limit(resPerPage).skip(skip).lean();
        res.status(200).json({ stocks });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetOnlyMenWears = GetOnlyMenWears;
const GetOnlyWomenWear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page);
        const skip = resPerPage * (currentPage - 1);
        const seletedfileld = "name price images";
        const stocks = yield Stock_model_1.Stock.find({
            stockType: stocks_enum_1.StockTypes.WOMEN_CLOTHES,
            deleted: false
        }).select(seletedfileld).limit(resPerPage).skip(skip).lean();
        res.status(200).json({ stocks });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetOnlyWomenWear = GetOnlyWomenWear;
//from here set
const GetOnlyHairs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page);
        const skip = resPerPage * (currentPage - 1);
        const seletedfileld = "name price images";
        const stocks = yield Stock_model_1.Stock.find({
            stockType: stocks_enum_1.StockTypes.HAIR,
            deleted: false
        }).select(seletedfileld).limit(resPerPage).skip(skip).lean();
        res.status(200).json({ stocks });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetOnlyHairs = GetOnlyHairs;
const GetOnlyComestics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page);
        const skip = resPerPage * (currentPage - 1);
        const seletedfileld = "name price images";
        const stocks = yield Stock_model_1.Stock.find({
            stockType: stocks_enum_1.StockTypes.COMESTICS,
            deleted: false
        }).select(seletedfileld).limit(resPerPage).skip(skip).lean();
        res.status(200).json({ stocks });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetOnlyComestics = GetOnlyComestics;
const GetOnlyShoes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resPerPage = 20;
        const currentPage = Number(req.query.page);
        const skip = resPerPage * (currentPage - 1);
        const seletedfileld = "name price images";
        const stocks = yield Stock_model_1.Stock.find({
            stockType: stocks_enum_1.StockTypes.SHOES,
            deleted: false
        }).select(seletedfileld).limit(resPerPage).skip(skip).lean();
        res.status(200).json({ stocks });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetOnlyShoes = GetOnlyShoes;
const GetOneStockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramid = req.params.id;
        const seletedfileld = "name price images";
        const stock = yield Stock_model_1.Stock.findOne({ _id: paramid, deleted: false }).select(seletedfileld).lean();
        if (!stock) {
            return res.status(404).json({ msg: `id ${paramid} not found` });
        }
        res.status(200).json({ stock });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.GetOneStockById = GetOneStockById;
const FindStocksByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resPerPage = 6;
    const currentPage = Number(req.query.page);
    const skip = resPerPage * (currentPage - 1);
    try {
        const stockname = req.params.name;
        const regex = new RegExp(stockname, 'i');
        const selectedFields = "name price images";
        const stock = yield Stock_model_1.Stock.find({ name: regex, deleted: false }).select(selectedFields).limit(resPerPage).skip(skip).lean();
        if (!stock || stock.length === 0) {
            return res.status(404).json({ msg: `Stock with name '${stockname}' not found` });
        }
        res.status(200).json({ stock });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.FindStocksByName = FindStocksByName;
const DeleteStockById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramid = req.params.id;
        const cloth = yield Stock_model_1.Stock.findById(paramid);
        if (!cloth) {
            return res.status(404).json({ msg: "Stock not found" });
        }
        try {
            yield cloudinary_config_1.cloudinary.uploader.destroy(cloth.cloudinary_id);
        }
        catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
        }
        yield Stock_model_1.Stock.findByIdAndDelete(paramid);
        res.json({ msg: 'Stock deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.DeleteStockById = DeleteStockById;
const AddToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    const { items } = req.body;
    const requiredFields = ['id', 'size', 'color'];
    for (const field of requiredFields) {
        if (!items.every((item) => item[field])) {
            return res.status(400).json({ msg: `${field} must be selected for each item` });
        }
    }
    try {
        const customSession = req.session;
        if (!user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }
        let cart = [];
        for (const item of items) {
            const stock = yield Stock_model_1.Stock.findOne({ _id: item.id });
            if (!(stock === null || stock === void 0 ? void 0 : stock._id)) {
                return res.status(404).json({ msg: `Product with ID ${item.id} not found` });
            }
            if ((stock === null || stock === void 0 ? void 0 : stock.outofstock) === true) {
                return res.status(404).json({ msg: `Selected product ${stock._id} out of stock` });
            }
            cart.push({
                id: stock._id.toString(),
                price: stock.price,
                quantity: item.quantity || 1,
                size: item.size,
                color: item.color,
            });
        }
        ;
        // let totalCartPrice = 0;
        // for (const item of cart) {
        //   totalCartPrice += item.price * item.quantity;
        // }
        if (!cart || cart.length === 0) {
            return res.status(405).json({ msg: "Your cart is empty" });
        }
        customSession.cart = cart;
        res.status(200).json({ message: 'Products added to cart', cart });
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error", error });
    }
});
exports.AddToCart = AddToCart;
const ConfirmedOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    const customSession = req.session;
    const cartItems = customSession;
    try {
        if (!user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }
        if (!cartItems.passport) {
            return res.status(403).json({ msg: "can not proceed" });
        }
        if (user._id.toString() !== cartItems.passport.user.toString()) {
            console.log(user._id.toString(), cartItems.passport.user.toString());
            return res.status(401).json({ msg: 'id not same, can not proceed ' });
        }
        let totalCartPrice = 0;
        if (cartItems.cart && cartItems.cart.length > 0) {
            for (const item of cartItems.cart) {
                totalCartPrice += item.price * item.quantity;
            }
        }
        return res.status(201).json({ msg: cartItems.cart, totalCartPrice });
        // res.send(`items selected for purchase, ${cartItems}`);
        // res.render('orderPageHtml', {cart: cartItems})//this is when sending it to the frontend
    }
    catch (error) {
    }
});
exports.ConfirmedOrder = ConfirmedOrder;
const StocksPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    const customSession = req.session;
    const cartItems = customSession;
    try {
        if (!user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }
        if (!cartItems.passport) {
            return res.status(403).json({ msg: "can not proceed" });
        }
        if (user._id.toString() !== cartItems.passport.user.toString()) {
            console.log(user._id.toString(), cartItems.passport.user.toString());
            return res.status(401).json({ msg: 'id not same, can not proceed ' });
        }
        let totalCartPrice = 0;
        if (cartItems.cart && cartItems.cart.length > 0) {
            for (const item of cartItems.cart) {
                totalCartPrice += item.price * item.quantity;
            }
        }
        const params = JSON.stringify({
            "email": user.email,
            "amount": totalCartPrice * 100
        });
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SRCRET}`,
                'Content-Type': 'application/json'
            }
        };
        const reqParam = https.request(options, reqParam => {
            let data = '';
            reqParam.on('data', (chunk) => {
                data += chunk;
            });
            reqParam.on('end', () => {
                res.status(200).json({ msg: data });
                console.log(data);
            });
        }).on('error', error => {
            console.error(error);
        });
        reqParam.write(params);
        reqParam.end();
    }
    catch (error) {
    }
});
exports.StocksPayment = StocksPayment;
const VerifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const referId = req.params.referenceId;
    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${referId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SRCRET}`,
            'Content-Type': 'application/json'
        }
    };
    const request = https.request(options, resParam => {
        let data = '';
        resParam.on('data', (chunk) => {
            data += chunk;
        });
        resParam.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                if (responseData.status) {
                    //define entities to save in db here.like
                    //amount, reference, user_email, user_fullName, transactiion_status,
                    //product purchase id and so on depending on what you need
                    const amount = responseData.data.amount / 100;
                    console.log(responseData);
                    res.status(200).json({ msg: responseData });
                }
                else {
                    res.status(400).json({ msg: 'Payment verification failed', details: responseData.message });
                }
            }
            catch (error) {
                res.status(500).json({ msg: 'Internal server error', error });
            }
        });
    });
    request.on('error', error => {
        res.status(500).json({ msg: 'Internal server error', error });
    });
    request.end(); // Ensure to end the request
});
exports.VerifyPayment = VerifyPayment;
