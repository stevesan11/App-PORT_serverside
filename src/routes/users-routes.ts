import express from "express";
import { body } from "express-validator";

import { checkLocalAuth } from "../middleware/check-auth";
import uploadFile from "../middleware/file-upload";

import { getAllUsers, login, signup } from "../controllers/user-controllers";

const router = express.Router();

router.get("/", getAllUsers);

router.post(
	"/signup",
	[
		body("username").notEmpty().trim().matches(/^\w*$/).isLength({ min: 3, max: 20 }),
		body("email")
			.notEmpty()
			.isEmail()
			.normalizeEmail()
			.matches(/^\S+@\S+\.\S+$/)
			.isLength({ min: 6, max: 320 }),
		body("password")
			.notEmpty()
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\w*$/)
			.isLength({ min: 8, max: 60 }),
	],
	uploadFile,
	signup
);

router.post(
	"/login",
	[
		body("email")
			.notEmpty()
			.isEmail()
			.normalizeEmail()
			.matches(/^\S+@\S+\.\S+$/)
			.isLength({ min: 6, max: 320 }),
		body("password")
			.notEmpty()
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\w*$/)
			.isLength({ min: 8, max: 60 }),
	],
	checkLocalAuth,
	login
);

export default router;
