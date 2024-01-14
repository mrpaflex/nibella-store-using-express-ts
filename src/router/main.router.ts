import  express from "express";
export const main_router = express.Router();
import {homePage} from '../controller/home.controller'
import {LogInUser, SignUp} from '../controller/auth.controller'
 import { UploadStock } from "../controller/stocks.controller";
 import { ensureAuth } from "../middleware/passport.middleware";
 import { restrict } from "../middleware/user.role";
 import { UserType } from "../enum/user.enum";
import { multerUpload } from "../common/multer/multer.upload";

main_router.get('/', homePage);
main_router.post('/user/signup', SignUp);
main_router.post('/user/login', LogInUser);
main_router.post('/upload/stock', ensureAuth, restrict([UserType.ADMIN]), multerUpload.single('file'), UploadStock);
