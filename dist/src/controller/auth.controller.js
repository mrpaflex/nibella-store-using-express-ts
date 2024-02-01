"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfile = exports.UnSuspendUser = exports.SuspendUser = exports.LogInUser = exports.SignUp = void 0;
const User_model_1 = require("../model/User.model");
const express_validator_1 = require("express-validator");
const hashedPassword_1 = require("../common/hashedPassword");
const passport_1 = __importDefault(require("passport"));
// import { ExludeField } from "../model/exclude/excludefield.user";
// import { UpdateUserInfo } from "../model/dto/updateUser";
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        let errorArray = errors.array();
        return res.status(400).json({ msg: errorArray[0].msg });
    }
    try {
        const { fullName, email, gender, password, userName, telephone, address } = req.body;
        const requiredFields = ['fullName', 'email', 'userName', 'telephone'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ msg: `${field} is required` });
            }
        }
        const user = yield User_model_1.User.findOne({
            $or: [{ email: email }, { userName: userName }],
        });
        if (user) {
            return res.status(400).json({ msg: 'User with the same credentials already exists' });
        }
        const hashedPassw = yield (0, hashedPassword_1.hashedPassword)(password);
        const createUser = yield User_model_1.User.create({
            fullName: fullName,
            email: email,
            password: hashedPassw,
            gender: gender,
            userName: userName,
            telephone: telephone,
            address: address,
        });
        return res.json({
            Respone: `you have successfully sign up ${createUser.fullName}`
        });
    }
    catch (error) {
        return res.status(400).json({ msg: 'Server error while signing up', error });
    }
});
exports.SignUp = SignUp;
const LogInUser = (req, res, next) => {
    passport_1.default.authenticate('local', (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return res.status(400).json({ msg: err });
            }
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            req.logIn(user, (err) => {
                // req.user = user;
                if (err) {
                    next(err);
                    //  return res.status(400).json({msg: err}) 
                }
                //return req.user;
                // res.status(200).json({msg: user})
                return res.json({ msg: 'Login successful' });
            });
        }
        catch (error) {
            next(error);
        }
    }))(req, res, next);
};
exports.LogInUser = LogInUser;
const SuspendUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramid = req.params.id;
        const user = yield User_model_1.User.findOne({ _id: paramid });
        if (!user) {
            return res.status(404).json({ msg: `User with id ${paramid} not found` });
        }
        if (user.suspended === true) {
            return res.status(402).json({ msg: `User ${user.fullName} has already been suspended` });
        }
        yield User_model_1.User.findOneAndUpdate({ _id: paramid }, { $set: { suspended: true } }, { new: true, runValidators: true }).lean();
        return res.json({ msg: `User with id ${paramid} suspended successfully` });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.SuspendUser = SuspendUser;
const UnSuspendUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramid = req.params.id;
        const user = yield User_model_1.User.findOne({ _id: paramid });
        if (!user) {
            return res.status(404).json({ msg: `User with id ${paramid} not found` });
        }
        if (user.suspended === false) {
            return res.status(402).json({ msg: `User ${user.fullName} was not suspended` });
        }
        yield User_model_1.User.findOneAndUpdate({ _id: paramid }, { $set: { suspended: false } }, { new: true, runValidators: true }).lean();
        return res.json({ msg: `User with id ${paramid} is not longer suspended` });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.UnSuspendUser = UnSuspendUser;
const EditProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paramid = req.params.id;
        const UpdateUserInfo = req.body;
        const requiredFields = Object.keys(UpdateUserInfo);
        if (requiredFields.length === 0) {
            return res.status(405).json({ msg: "At least one field is required" });
        }
        const user = yield User_model_1.User.findById(paramid);
        if (!user) {
            return res.status(404).json({ msg: `User with id ${paramid} not found` });
        }
        if (user._id.toString() !== req.user._id.toString()) {
            //console.log(user._id.toString(), (req.user as IUser)._id.toString() )
            return res.status(403).json({ msg: "You can only update your profile" });
        }
        yield User_model_1.User.findByIdAndUpdate(paramid, UpdateUserInfo, { new: true, runValidators: true }).lean();
        return res.json({ msg: `Profile updated successfully` });
    }
    catch (error) {
        return res.status(500).json({ msg: 'Internal Server Error', error });
    }
});
exports.EditProfile = EditProfile;
