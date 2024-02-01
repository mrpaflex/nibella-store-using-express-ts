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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const db_1 = require("./configdb/db");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const main_router_1 = require("./router/main.router");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const passport_local_strategy_1 = require("./strategy/passport.local.strategy");
const cors = require('cors');
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = express();
(0, passport_local_strategy_1.PassportStrategy)(passport_1.default);
(0, db_1.connectDB)();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const token = process.env.SECRET_TOKEN;
if (!token) {
    throw new Error('SECRET_TOKEN is not defined in the environment variables');
}
app.use((0, express_session_1.default)({
    secret: token,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1 * 60 * 60 * 1000 //1 hours
    },
    store: connect_mongo_1.default.create({ mongoUrl: process.env.MONGO_URI }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.authenticate('session'));
app.use(main_router_1.main_router);
const port = process.env.NODE_LOCAL_PORT || 3000;
app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
});
