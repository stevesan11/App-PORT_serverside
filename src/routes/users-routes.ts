import express, { Request, Response, NextFunction } from "express";
import HttpError from "../model/http-error";

import { UserData } from "../model/userModel";
import User from "../model/userModel";

import uploadFile from "../middleware/file-upload";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	let users;
	try {
		users = await User.find({}, "username image apps").exec();
	} catch (err) {
		return next(new HttpError("Fetching users failed, please try again later", 500));
	}
	res.status(201).json(users);
});

router.post("/signup", uploadFile, async (req: Request, res: Response, next: NextFunction) => {
	const { username, email, password } = req.body;

	if (!req.file) {
		next(new HttpError("Please provide an image", 500));
	}

	let existingName;
	try {
		existingName = await User.findOne({ username });
	} catch (err) {
		next(new HttpError("Signning up is failed, please try again later", 500));
	}
	if (existingName) {
		next(new HttpError("This username is already taken", 409));
	}

	let existingEmail;
	try {
		existingEmail = await User.findOne({ email });
	} catch (err) {
		next(new HttpError("Signning up is failed, please try again later", 422));
	}
	if (existingEmail) {
		next(new HttpError("User exist already, please login instead", 409));
	}

	const newUser = new User({
		username,
		email,
		password,
		image: req.file?.path,
		apps: [],
	});
	try {
		await newUser.save();
	} catch (err) {
		return next(new HttpError("Signning up is failed, please try again later", 500));
	}
	res.status(201).json({ newUser });
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	let existingUser: UserData | null;
	try {
		existingUser = await User.findOne({ email }, "username password image apps").exec();
	} catch (err) {
		return next(new HttpError("Loggeing in failed, please try again later", 500));
	}
	if (!existingUser) {
		return next(new HttpError("Could not idntify user, credentials seems to be wrong", 401));
	}
	if (password !== existingUser.password) {
		return next(new HttpError("Invalid credentials, could not logged in", 401));
	}
	res.status(201).json({ existingUser });
});

export default router;
