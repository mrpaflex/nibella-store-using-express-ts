import  express from "express";
export const main_router = express.Router();
import {homePage} from '../controller/home.controller'

main_router.get('/', homePage)
