import  express from "express";
export const main_router = express.Router();
import {homePage} from '../controller/home.controller'
import {LogInUser, SignUp} from '../controller/auth.controller'

main_router.get('/', homePage);
main_router.post('/user/signup', SignUp);
main_router.post('/user/login', LogInUser);
