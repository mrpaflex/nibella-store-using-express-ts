"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderType = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "admin";
    UserType["CUSTOMER"] = "customer";
    UserType["MODERATOR"] = "moderator";
})(UserType || (exports.UserType = UserType = {}));
;
var GenderType;
(function (GenderType) {
    GenderType["MALE"] = "male";
    GenderType["FEMALE"] = "female";
})(GenderType || (exports.GenderType = GenderType = {}));
