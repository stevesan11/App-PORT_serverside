import fs from "fs";

import express, { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";

import uploadFile from "../middleware/file-upload";

import App from "../model/appModel";
import User, { UserData } from "../model/userModel";
import HttpError from "../model/http-error";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	let apps;
	try {
		apps = await App.find({});
	} catch (error) {
		return next(new HttpError("Fetching appss failed, please try again later", 500));
	}
	if (!apps) {
		return next(new HttpError("None of the apps data exists.", 204));
	}
	res.status(200).json({ apps });
});
router.get("/:appId", async (req: Request, res: Response, next: NextFunction) => {
	const appId = new mongoose.Types.ObjectId(req.params.appId);
	let apps;
	try {
		apps = await App.findById(appId);
	} catch (error) {
		return next(new HttpError("Fetching app is failed, please try again later", 500));
	}
	if (!apps) {
		return next(new HttpError("Invalid application ID, could not find", 400));
	}
	res.status(200).json({ apps });
});
router.get("/user/:userId", async (req: Request, res: Response, next: NextFunction) => {
	const userId = new mongoose.Types.ObjectId(req.params.userId);

	if (!req.file) {
		return next(new HttpError("Please provide an image", 500));
	}

	let app;
	try {
		app = await User.findById(userId).populate("apps");
	} catch (error) {
		return next(new HttpError("Fetching app is failed, please try again later", 500));
	}
	if (!app) {
		return next(new HttpError("Invalid user ID, could not find", 400));
	}
	res.status(200).json({ app });
});
router.post("/", uploadFile, async (req: Request, res: Response, next: NextFunction) => {
	const { title, description, url, author } = req.body;

	if (!req.file) {
		return next(new HttpError("Please provide an image", 400));
	}

	let existingUser;
	try {
		existingUser = await User.findById(author);
	} catch (error) {
		return next(new HttpError("Creating app failed, please try again later", 500));
	}
	if (!existingUser) {
		return next(new HttpError("Cannot find user for provided id", 400));
	}

	const newApp = new App({
		title,
		description,
		image: req.file.path,
		url,
		author,
	});

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		await newApp.save({ session });
		existingUser.apps.push(newApp.id);
		await existingUser.save({ session });
		await session.commitTransaction();
		session.endSession();
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		return next(new HttpError("Creating app failed, please try again later", 500));
	} finally {
		res.status(201).json({ newApp });
	}
});
router.patch("/:appId", uploadFile, async (req: Request, res: Response, next: NextFunction) => {
	const appId = new mongoose.Types.ObjectId(req.params.appId);
	const { title, description, url } = req.body;

	if (!req.file) {
		return next(new HttpError("Please provide an image", 400));
	}

	let app;
	try {
		app = await App.findById(appId);
	} catch (error) {
		return next(new HttpError("Fetching app is failed, please try again later", 500));
	}
	if (!app) {
		return next(new HttpError("Invalid app id, could not find", 400));
	}

	const { image: prevImage } = app;
	app.title = title;
	app.description = description;
	app.url = url;
	app.image = req.file.path;
	try {
		await app.save();
	} catch (error) {
		return next(new HttpError("Something went wrong,Could not update application", 500));
	} finally {
		fs.unlink(prevImage, (err) => {
			if (err) {
				console.log(err);
			}
		});
		res.status(201).json({ app });
	}
});
router.delete("/:appId", async (req: Request, res: Response, next: NextFunction) => {
	const appId = new mongoose.Types.ObjectId(req.params.appId);
	let app;
	try {
		app = await App.findById(appId).populate<{
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			author: mongoose.Document<unknown, any, UserData> & UserData;
		}>("author");
	} catch (error) {
		return next(new HttpError("Something wen wrong, please try again later", 500));
	}
	if (!app) {
		return next(new HttpError("Invalid app id, could not find", 400));
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const update = app.author.apps.filter((app: Types.ObjectId) => !app.equals(appId));
		await app.author.updateOne({ apps: update }, { session });
		await app.remove({ session });
		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		return next(new HttpError("Something went wrong, please try again later"));
	} finally {
		session.endSession();
		fs.unlink(app.image, (err) => {
			if (err) {
				console.log(err);
			}
		});
		res.status(200).json({ message: "Successfully deleted of app" });
	}
});

export default router;
