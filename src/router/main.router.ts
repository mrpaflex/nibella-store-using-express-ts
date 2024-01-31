import  express from "express";
export const main_router = express.Router();
import {homePage} from '../controller/home.controller'
import {LogInUser, SignUp, SuspendUser, UnSuspendUser, EditProfile} from '../controller/auth.controller'
import {GetAllClothes, UploadStock, GetOneStockById, DeleteStockById, AddToCart, ConfirmedOrder, StocksPayment, VerifyPayment, FindStocksByName} from "../controller/stocks.controller";
import { ensureAuth } from "../middleware/passport.middleware";
import { restrict } from "../middleware/user.role";
import { UserType } from "../enum/user.enum";
import { multerUpload } from "../common/multer/multer.upload";

main_router.get('/', homePage);

main_router.post('/user/Signup', SignUp);

main_router.post('/user/Login', LogInUser);

main_router.post('/upload/stock', ensureAuth, restrict([UserType.ADMIN]), multerUpload.single('file'), UploadStock);

main_router.get('/stock/findAll', GetAllClothes );

main_router.get('/stock/findOne/:id', GetOneStockById);

main_router.get('/stock/findItemsByName/:name', FindStocksByName);

main_router.delete('/delete/stockById/:id', ensureAuth, restrict([UserType.ADMIN, UserType.MODERATOR]), DeleteStockById);

main_router.put('/user/suspend/:id', ensureAuth, restrict([UserType.ADMIN, UserType.MODERATOR]), SuspendUser);

main_router.put('/user/unSuspend/:id', ensureAuth, restrict([UserType.ADMIN, UserType.MODERATOR]), UnSuspendUser);

main_router.put('/user/editProfile/:id', ensureAuth, EditProfile);

main_router.post('/user/addToCart',ensureAuth, AddToCart);

main_router.get('/confirmed/orderPage', ensureAuth, ConfirmedOrder);
main_router.post('/stock/payment',ensureAuth, StocksPayment);

main_router.get('/verify/payment/:referenceId', ensureAuth, VerifyPayment);

