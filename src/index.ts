import fs from "fs";

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import usersRoutes from "./routes/users-routes";
import appsRoutes from "./routes/apps-routes";

import HttpError from "./model/http-error";

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", usersRoutes);
app.use("/api/app", appsRoutes);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			if (err) {
				console.log(err);
			}
		});
	}
	if (res.headersSent) {
		return next(err);
	}
	res.status(err.errorCode || 500);
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
