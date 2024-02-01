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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportStrategy = void 0;
const passport_local_1 = require("passport-local");
const User_model_1 = require("../model/User.model");
const hashedPassword_1 = require("../common/hashedPassword");
const PassportStrategy = (passport) => __awaiter(void 0, void 0, void 0, function* () {
    passport.use(new passport_local_1.Strategy({ usernameField: 'userName' }, (userName, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_model_1.User.findOne({ userName: userName });
            if (!user) {
                return done(null, false);
            }
            //check if password matched
            if ((yield (0, hashedPassword_1.comparedPassword)(password, user.password)) === false) {
                return done(null, false, { message: "password do not matched" });
            }
            //return the user that is loggd in
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    })));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_model_1.User.findById(id);
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
});
exports.PassportStrategy = PassportStrategy;
//   export {}
// declare global {
//   namespace Express {
//     interface Request {
//       user?: User | undefined;
//     }
//   }
// }
