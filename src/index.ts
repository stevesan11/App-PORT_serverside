import path from "path";

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import passport from "./middleware/check-auth";
// import cors from "cors";
import "dotenv/config";

import usersRoutes from "./routes/users-routes";
import appsRoutes from "./routes/apps-routes";

import HttpError from "./model/http-error";
import { deleteAWSObject } from "./middleware/file-upload";

const app: express.Express = express();

// app.use(
// 	cors({
// 		origin: process.env.FRONT_URL,
// 		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
// 		methods: ["GET", "POST", "PATCH", "DELETE"],
// 		optionsSuccessStatus: 200,
// 	})
// );
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(express.static(path.join(__dirname, "client")));

app.use("/api/user", usersRoutes);
app.use("/api/app", appsRoutes);

//index.html redirectt rewritecofig
app.use((req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	const file = req.file as Express.MulterS3.File;
	if (file) {
		deleteAWSObject(file.key);
	}
	if (res.headersSent) {
		return next(err);
	}
	res.status(err.errorCode || 500).json({ message: err.message || "An unknown error occured" });
	throw err;
});

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster0.seh7p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(process.env.PORT || 3030);
		console.log("Processing on port 3030");
	})
	.catch((err) => console.log(err));
