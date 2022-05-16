import express from "express";

import uploadFile from "../middleware/file-upload";

import {
	createNewApp,
	deleteApp,
	getAllApps,
	getAppById,
	getAppByUserId,
	updateApp,
} from "../controllers/apps-controllers";
import { checkJwtAuth } from "../middleware/check-auth";

const router = express.Router();

router.get("/", getAllApps);
router.get("/:appId", getAppById);
router.get("/user/:userId", getAppByUserId);

router.use(checkJwtAuth);
router.post("/", uploadFile, createNewApp);
router.patch("/:appId", uploadFile, updateApp);
router.delete("/:appId", deleteApp);

export default router;
