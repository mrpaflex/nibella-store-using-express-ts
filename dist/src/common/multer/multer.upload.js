"use strict";
// import { NextFunction, Request } from 'express';
// import multer from 'multer';
// import path from 'path';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.multerUpload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    fileFilter(req, file, next) {
        const filename = file.originalname;
        const spiltname = filename.split('.');
        const random = Math.round(Math.random() * 100);
        const newFileName = `${spiltname[0]}_${random}.${spiltname[1]}`;
        const ext = path_1.default.extname(newFileName).toLowerCase();
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return next(new Error('Only JPG, JPEG, and PNG files are allowed.'));
        }
        return next(null, true);
    },
});
