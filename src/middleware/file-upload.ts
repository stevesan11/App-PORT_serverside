import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import HttpError from "../model/http-error";

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
	const MIME_TYPE: { [key: string]: string } = {
		"image/png": "png",
		"image/jpeg": "jpg",
	};

	const upload = multer({
		limits: { fileSize: 1024 * 1024 * 5 }, //5MB
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, "./uploads/images");
			},
			filename: function (req, file, cb) {
				const ext = MIME_TYPE[file.mimetype];
				cb(null, uuidv4() + "." + ext);
			},
		}),
		fileFilter(req, file, cb) {
			const isValid = file.mimetype in MIME_TYPE;
			if (isValid) {
				cb(null, true);
			} else {
				cb(
					new Error(
						"File extensions provided are not allowed please provide in .png/.jpg/.jpeg file"
					)
				);
			}
		},
	}).single("image");

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return next(new HttpError(err.message, 400));
		} else if (err) {
			return next(new HttpError(err.message, 406));
		}
		next();
	});
};

export default uploadFile;
