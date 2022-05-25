import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import HttpError from "../model/http-error";

import User, { UserData } from "../model/userModel";
import { AppData } from "../model/appModel";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	let user;
	try {
		user = await User.find({}, "username image").populate<{
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			apps: mongoose.Document<unknown, any, AppData> & AppData;
		}>("apps", "-author");
	} catch (err) {
		return next(new HttpError("Fetching users failed, please try again later", 500));
	}
	if (!user) {
		return next(new HttpError("None of the user data exists.", 204));
	}
	res.status(201).json({ user });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	const { username, email, password } = req.body;
	const file = req.file as Express.MulterS3.File;

	if (!file) {
		return next(new HttpError("Please provide an image", 400));
	}

	let existingName;
	try {
		existingName = await User.findOne({ username });
	} catch (error) {
		return next(new HttpError("Signning up is failed, please try again later", 500));
	}
	if (existingName) {
		return next(new HttpError("This username is already taken", 409));
	}

	let existingEmail;
	try {
		existingEmail = await User.findOne({ email });
	} catch (error) {
		return next(new HttpError("Signning up is failed, please try again later", 422));
	}
	if (existingEmail) {
		return next(new HttpError("User exist already, please login instead", 409));
	}

	const newUser = new User({
		username,
		email,
		password,
		image: file.key,
		apps: [],
	});
	try {
		await newUser.save();
	} catch (error) {
		return next(new HttpError("Signning up is failed, please try again later", 500));
	}
	const payload = { userId: newUser._id, email: newUser.email };
	const token = jwt.sign(payload, process.env.JWT_PASS as string, { expiresIn: "1h" });
	res.status(201).json({ userId: newUser._id, token });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as UserData;
	if (!user) {
		return next(new HttpError("Could not find a user for the provided email", 401));
	}
	const payload = { userId: user._id, email: user.email };
	const token = jwt.sign(payload, process.env.JWT_PASS as string, { expiresIn: "1h" });
	res.status(201).json({ userId: user._id, token });
};
