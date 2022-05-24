"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApp = exports.updateApp = exports.createNewApp = exports.getAppByUserId = exports.getAppById = void 0;
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const appModel_1 = __importDefault(require("../model/appModel"));
const userModel_1 = __importDefault(require("../model/userModel"));
const http_error_1 = __importDefault(require("../model/http-error"));
// export const getAllApps = async (req: Request, res: Response, next: NextFunction) => {
// 	let apps;
// 	try {
// 		apps = await App.find({});
// 	} catch (error) {
// 		return next(new HttpError("Fetching appss failed, please try again later", 500));
// 	}
// 	if (!apps) {
// 		return next(new HttpError("None of the apps data exists.", 204));
// 	}
// 	res.status(200).json({ apps });
// };
const getAppById = async (req, res, next) => {
    const appId = new mongoose_1.default.Types.ObjectId(req.params.appId);
    let app;
    try {
        app = await appModel_1.default.findById(appId, "-author");
    }
    catch (error) {
        return next(new http_error_1.default("Fetching app is failed, please try again later", 500));
    }
    if (!app) {
        return next(new http_error_1.default("Invalid application ID, could not find", 400));
    }
    res.status(200).json({ app });
};
exports.getAppById = getAppById;
const getAppByUserId = async (req, res, next) => {
    const userId = new mongoose_1.default.Types.ObjectId(req.params.userId);
    let user;
    try {
        user = await userModel_1.default.findById(userId, "username image").populate("apps", "-author");
    }
    catch (error) {
        return next(new http_error_1.default("Fetching app is failed, please try again later", 500));
    }
    if (!user) {
        return next(new http_error_1.default("Invalid user ID, could not find", 400));
    }
    res.status(200).json({ user });
};
exports.getAppByUserId = getAppByUserId;
const createNewApp = async (req, res, next) => {
    const { title, description, url } = req.body;
    const user = req.user;
    if (!user) {
        return next(new http_error_1.default("unknown user", 400));
    }
    if (!req.file) {
        return next(new http_error_1.default("Please provide an image", 400));
    }
    let existingUser;
    try {
        existingUser = await userModel_1.default.findById(user._id);
    }
    catch (error) {
        return next(new http_error_1.default("Creating app failed, please try again later", 500));
    }
    if (!existingUser) {
        return next(new http_error_1.default("Cannot find user for provided id", 400));
    }
    const newApp = new appModel_1.default({
        title,
        description,
        image: req.file.path,
        url,
        author: user._id,
    });
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        await newApp.save({ session });
        existingUser.apps.push(newApp.id);
        await existingUser.save({ session });
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        return next(new http_error_1.default("Creating app failed, please try again later", 500));
    }
    finally {
        session.endSession();
        const app = {
            _id: newApp._id,
            title: newApp.title,
            description: newApp.title,
            image: newApp.image,
            url: newApp.url,
        };
        res.status(201).json({ app });
    }
};
exports.createNewApp = createNewApp;
const updateApp = async (req, res, next) => {
    const appId = new mongoose_1.default.Types.ObjectId(req.params.appId);
    const { title, description, url, author } = req.body;
    const user = req.user;
    if (!user) {
        return next(new http_error_1.default("unknown user", 400));
    }
    let app;
    try {
        app = await appModel_1.default.findById(appId);
    }
    catch (error) {
        return next(new http_error_1.default("Fetching app is failed, please try again later", 500));
    }
    if (!app) {
        return next(new http_error_1.default("Invalid app id, could not find", 400));
    }
    if (!app.author.equals(author)) {
        return next(new http_error_1.default("You are not allowed to edit this place", 403));
    }
    const { image: prevImage } = app;
    app.title = title;
    app.description = description;
    app.url = url;
    app.image = req.file ? req.file.path : app.image;
    try {
        await app.save();
        if (!req.file)
            return;
        await fs_1.default.unlink(prevImage, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    catch (error) {
        return next(new http_error_1.default("Something went wrong,Could not update application", 500));
    }
    finally {
        res.status(201).json({ app });
    }
};
exports.updateApp = updateApp;
const deleteApp = async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new http_error_1.default("unknown user", 400));
    }
    const appId = new mongoose_1.default.Types.ObjectId(req.params.appId);
    let app;
    try {
        app = await appModel_1.default.findById(appId).populate("author");
    }
    catch (error) {
        return next(new http_error_1.default("Something wen wrong, please try again later", 500));
    }
    if (!app) {
        return next(new http_error_1.default("Invalid app id, could not find", 400));
    }
    if (!app.author._id.equals(user._id)) {
        return next(new http_error_1.default("You are not allowed to edit this place", 403));
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const update = app.author.apps.filter((app) => !app.equals(appId));
        await app.author.updateOne({ apps: update }, { session });
        await app.remove({ session });
        await session.commitTransaction();
        await fs_1.default.unlink(app.image, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    catch (error) {
        await session.abortTransaction();
        return next(new http_error_1.default("Something went wrong, please try again later"));
    }
    finally {
        session.endSession();
        const resApp = {
            _id: app._id,
            title: app.title,
            description: app.description,
            image: app.image,
            url: app.url,
        };
        res.status(200).json({ app: resApp });
    }
};
exports.deleteApp = deleteApp;
//# sourceMappingURL=apps-controllers.js.map