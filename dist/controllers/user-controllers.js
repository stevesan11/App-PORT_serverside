"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.getAllUsers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const http_error_1 = __importDefault(require("../model/http-error"));
const userModel_1 = __importDefault(require("../model/userModel"));
const getAllUsers = async (req, res, next) => {
    let user;
    try {
        user = await userModel_1.default.find({}, "username image").populate("apps", "-author");
    }
    catch (err) {
        return next(new http_error_1.default("Fetching users failed, please try again later", 500));
    }
    if (!user) {
        return next(new http_error_1.default("None of the user data exists.", 204));
    }
    res.status(201).json({ user });
};
exports.getAllUsers = getAllUsers;
const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const file = req.file;
    if (!file) {
        return next(new http_error_1.default("Please provide an image", 400));
    }
    let existingName;
    try {
        existingName = await userModel_1.default.findOne({ username });
    }
    catch (error) {
        return next(new http_error_1.default("Signning up is failed, please try again later", 500));
    }
    if (existingName) {
        return next(new http_error_1.default("This username is already taken", 409));
    }
    let existingEmail;
    try {
        existingEmail = await userModel_1.default.findOne({ email });
    }
    catch (error) {
        return next(new http_error_1.default("Signning up is failed, please try again later", 422));
    }
    if (existingEmail) {
        return next(new http_error_1.default("User exist already, please login instead", 409));
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt_1.default.hash(password, parseInt(process.env.SALT_ROUNDS));
    }
    catch (error) {
        return next(new http_error_1.default("Password hashing failed, please try again later", 500));
    }
    const newUser = new userModel_1.default({
        username,
        email,
        password: hashedPassword,
        image: file.key,
        apps: [],
    });
    try {
        await newUser.save();
    }
    catch (error) {
        return next(new http_error_1.default("Signning up is failed, please try again later", 500));
    }
    const payload = { userId: newUser._id, email: newUser.email };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_PASS, { expiresIn: "1h" });
    res.status(201).json({ userId: newUser._id, token });
};
exports.signup = signup;
const login = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new http_error_1.default("Could not find a user for the provided email", 401));
    }
    const payload = { userId: user._id, email: user.email };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_PASS, { expiresIn: "1h" });
    res.status(201).json({ userId: user._id, token });
};
exports.login = login;
//# sourceMappingURL=user-controllers.js.map