"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrict = void 0;
const restrict = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRoles = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userRole;
        if (!userRoles || !userRoles.some((role) => allowedRoles.includes(role))) {
            return res.status(403).json({ msg: 'You are not allowed to access this route' });
        }
        return next();
    };
};
exports.restrict = restrict;
