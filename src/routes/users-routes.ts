import express from "express";
import { checkLocalAuth } from "../middleware/check-auth";

import uploadFile from "../middleware/file-upload";
import { getAllUsers, login, signup } from "../controllers/user-controllers";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/signup", uploadFile, signup);

router.post("/login", checkLocalAuth, login);

export default router;
