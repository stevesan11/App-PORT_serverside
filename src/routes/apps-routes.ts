import express from "express";
import { body } from "express-validator";

import { checkJwtAuth } from "../middleware/check-auth";
import uploadFile from "../middleware/file-upload";

import {
	createNewApp,
	deleteApp,
	getAppById,
	getAppByUserId,
	updateApp,
} from "../controllers/apps-controllers";

const router = express.Router();

router.get("/:appId", getAppById);
router.get("/user/:userId", getAppByUserId);

router.use(checkJwtAuth);
router.post(
	"/",
	[
		body("title").notEmpty().matches(/^.*$/).isLength({ min: 3, max: 30 }),
		body("description").notEmpty().matches(/^.*$/).isLength({ min: 10, max: 300 }),
		body("url")
			.notEmpty()
			.matches(
				/https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
			)
			.isLength({ min: 13, max: 2083 }),
	],
	uploadFile,
	createNewApp
);
router.patch(
	"/:appId",
	[
		body("title").notEmpty().matches(/^.*$/).isLength({ min: 3, max: 30 }),
		body("description").notEmpty().matches(/^.*$/).isLength({ min: 10, max: 300 }),
		body("url")
			.notEmpty()
			.matches(
				/https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
			)
			.isLength({ min: 13, max: 2083 }),
	],
	uploadFile,
	updateApp
);
router.delete("/:appId", deleteApp);

export default router;
