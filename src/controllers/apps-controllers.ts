import fs from "fs";

import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";

import App, { AppData } from "../model/appModel";
import User, { UserData } from "../model/userModel";
import HttpError from "../model/http-error";

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

export const getAppById = async (req: Request, res: Response, next: NextFunction) => {
	const appId = new mongoose.Types.ObjectId(req.params.appId);
	let app;
	try {
		app = await App.findById(appId, "-author");
	} catch (error) {
		return next(new HttpError("Fetching app is failed, please try again later", 500));
	}
	if (!app) {
		return next(new HttpError("Invalid application ID, could not find", 400));
	}
	res.status(200).json({ app });
};

export const getAppByUserId = async (req: Request, res: Response, next: NextFunction) => {
	const userId = new mongoose.Types.ObjectId(req.params.userId);

	let user;
	try {
		user = await User.findById(userId, "username image").populate<{
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			apps: mongoose.Document<unknown, any, AppData>[] & AppData[];
		}>("apps", "-author");
	} catch (error) {
		return next(new HttpError("Fetching app is failed, please try again later", 500));
	}
	if (!user) {
		return next(new HttpError("Invalid user ID, could not find", 400));
	}
	res.status(200).json({ user });
};

export const createNewApp = async (req: Request, res: Response, next: NextFunction) => {
	const { title, description, url } = req.body;
	const user = req.user as UserData;

	if (!user) {
		return next(new HttpError("unknown user", 400));
	}
	if (!req.file) {
		return next(new HttpError("Please provide an image", 400));
	}

	let existingUser;
	try {
		existingUser = await User.findById(user._id);
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
		author: user._id,
	});

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		await newApp.save({ session });
		existingUser.apps.push(newApp.id);
		await existingUser.save({ session });
		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		return next(new HttpError("Creating app failed, please try again later", 500));
	} finally {
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

export const updateApp = async (req: Request, res: Response, next: NextFunction) => {
	const appId = new mongoose.Types.ObjectId(req.params.appId);
	const { title, description, url, author } = req.body;

	const user = req.user as UserData;
	if (!user) {
		return next(new HttpError("unknown user", 400));
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
	if (!app.author.equals(author)) {
		return next(new HttpError("You are not allowed to edit this place", 403));
	}

	const { image: prevImage } = app;
	app.title = title;
	app.description = description;
	app.url = url;
	app.image = req.file ? req.file.path : app.image;
	try {
		await app.save();
		if (!req.file) return;
		await fs.unlink(prevImage, (err) => {
			if (err) {
				console.log(err);
			}
		});
	} catch (error) {
		return next(new HttpError("Something went wrong,Could not update application", 500));
	} finally {
		res.status(201).json({ app });
	}
};

export const deleteApp = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as UserData;

	if (!user) {
		return next(new HttpError("unknown user", 400));
	}

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
	if (!app.author._id.equals(user._id)) {
		return next(new HttpError("You are not allowed to edit this place", 403));
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const update = app.author.apps.filter((app: Types.ObjectId) => !app.equals(appId));
		await app.author.updateOne({ apps: update }, { session });
		await app.remove({ session });
		await session.commitTransaction();
		await fs.unlink(app.image, (err) => {
			if (err) {
				console.log(err);
			}
		});
	} catch (error) {
		await session.abortTransaction();
		return next(new HttpError("Something went wrong, please try again later"));
	} finally {
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
