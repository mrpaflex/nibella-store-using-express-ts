"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_1 = require("../enum/user.enum");
const UserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    telephone: {
        type: String,
        required: true
    },
    password: {
        required: true,
        type: String
    },
    gender: {
        type: String,
        enum: Object.values(user_enum_1.GenderType),
        default: user_enum_1.GenderType.FEMALE,
    },
    address: {
        type: String,
        default: null
    },
    suspended: {
        type: Boolean,
        default: false,
    },
    userRole: {
        type: [String],
        required: true,
        enum: Object.values(user_enum_1.UserType),
        default: [user_enum_1.UserType.CUSTOMER],
    },
    date: {
        default: Date.now,
        type: Date
    }
});
const User = mongoose_1.default.model('User', UserSchema);
exports.User = User;
