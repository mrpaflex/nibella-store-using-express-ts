import  express from "express";
export const main_router = express.Router();
import {homePage} from '../controller/home.controller'
import {LogInUser, SignUp, SuspendUser, UnSuspendUser, EditProfile, LogoutUser, FindOneUser, FindAllUser, DeleteUser} from '../controller/auth.controller'
import {GetAllClothes, UploadStock, GetOneStockById, DeleteStockById, AddToCart, ConfirmedOrder, StocksPayment, VerifyPayment, FindStocksByName, GetOnlyMenWears, GetOnlyWomenWear, GetOnlyHairs, GetOnlyComestics, GetOnlyShoes} from "../controller/stocks.controller";
import { ensureAuth } from "../middleware/passport.middleware";
import { restrict } from "../middleware/user.role";
import { UserType } from "../enum/user.enum";
import { multerUpload } from "../common/multer/multer.upload";

main_router.get('/', homePage);

main_router.post('/user/Signup', SignUp);

main_router.post('/user/Login', LogInUser);

main_router.get('/user/findOne/:id', ensureAuth, restrict([UserType.ADMIN]), FindOneUser );
main_router.get('/user/findAll', FindAllUser );
// main_router.get('/user/findAll', ensureAuth, restrict([UserType.ADMIN]), FindAllUser );

main_router.post('/upload/stock', ensureAuth, restrict([UserType.ADMIN]), multerUpload.single('file'), UploadStock);

main_router.get('/user/logout', ensureAuth, LogoutUser );

main_router.get('/stock/findAll', GetAllClothes );

main_router.get('/stock/findOnlyMenWear', GetOnlyMenWears );

main_router.get('/stock/findOnlyWomenWear', GetOnlyWomenWear );

main_router.get('/stock/findOnlyHair', GetOnlyHairs );

main_router.get('/stock/findOnlyComestic', GetOnlyComestics );

main_router.get('/stock/findOnlyShoes', GetOnlyShoes );

main_router.get('/stock/findOne/:id', GetOneStockById);

main_router.get('/stock/findItemsByName/:name', FindStocksByName);

main_router.delete('/delete/stockById/:id', ensureAuth, restrict([UserType.ADMIN, UserType.MODERATOR]), DeleteStockById);

main_router.put('/user/suspend/:id', ensureAuth, restrict([UserType.ADMIN, UserType.MODERATOR]), SuspendUser);

main_router.put('/user/unSuspend/:id', ensureAuth, restrict([UserType.ADMIN, UserType.MODERATOR]), UnSuspendUser);

main_router.put('/user/editProfile/:id', ensureAuth, EditProfile);

main_router.get('/user/delete/:username', DeleteUser );

main_router.post('/user/addToCart',ensureAuth, AddToCart);

main_router.get('/confirmed/orderPage', ensureAuth, ConfirmedOrder);
main_router.post('/stock/payment',ensureAuth, StocksPayment);

main_router.get('/verify/payment/:referenceId', ensureAuth, VerifyPayment);

