"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwtAuth = exports.checkLocalAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
require("dotenv/config");
const userModel_1 = __importDefault(require("../model/userModel"));
const http_error_1 = __importDefault(require("../model/http-error"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    session: false,
}, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async (email, password, done) => {
    let existinguser;
    try {
        existinguser = await userModel_1.default.findOne({ email });
    }
    catch (error) {
        return done(null, false, {
            message: "Something went wrong, please try again later",
            errCode: 500,
        });
    }
    if (!existinguser) {
        return done(null, false, {
            message: "Could not find a user for the provided email",
            errCode: 401,
        });
    }
    if (existinguser.password !== password) {
        return done(null, false, {
            message: "Could not log you in, please check your credintials and try again",
            errCode: 401,
        });
    }
    else {
        return done(null, existinguser);
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.JWT_PASS,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async (jwt_payload, done) => {
    const user = await userModel_1.default.findById(jwt_payload.userId);
    if (!user) {
        return done(null, false, { message: "Cannot find user by payload date", errCode: 401 });
    }
    return done(null, user);
}));
const checkLocalAuth = (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return next(new http_error_1.default("Something went wrong, please try again later", 500));
        }
        if (!user) {
            return next(new http_error_1.default(info.message, info.errCode));
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.checkLocalAuth = checkLocalAuth;
const checkJwtAuth = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            return next(new http_error_1.default("Something went wrong, please try again later", 500));
        }
        if (!user) {
            return next(new http_error_1.default(info.message, info.errCode));
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.checkJwtAuth = checkJwtAuth;
exports.default = passport_1.default;
//# sourceMappingURL=check-auth.js.map