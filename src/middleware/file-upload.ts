import { Request, Response, NextFunction } from "express";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import HttpError from "../model/http-error";
import "dotenv/config";

aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_KEY,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
	const MIME_TYPE: { [key: string]: string } = {
		"image/png": "png",
		"image/jpg": "jpg",
		"image/jpeg": "jpeg",
	};

	const upload = multer({
		limits: { fileSize: 1024 * 1024 * 5 }, //5MB
		storage: multerS3({
			s3: s3,
			bucket: process.env.AWS_BUCKET as string,
			acl: "public-read",
			key: function (req, file, cb) {
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

	// const upload = multer({
	// 	limits: { fileSize: 1024 * 1024 * 5 }, //5MB
	// 	storage: multer.diskStorage({
	// 		destination: function (req, file, cb) {
	// 			cb(null, "./uploads/images");
	// 		},
	// 		filename: function (req, file, cb) {
	// 			const ext = MIME_TYPE[file.mimetype];
	// 			cb(null, uuidv4() + "." + ext);
	// 		},
	// 	}),
	// 	fileFilter(req, file, cb) {
	// 		const isValid = file.mimetype in MIME_TYPE;
	// 		if (isValid) {
	// 			cb(null, true);
	// 		} else {
	// 			cb(
	// 				new Error(
	// 					"File extensions provided are not allowed please provide in .png/.jpg/.jpeg file"
	// 				)
	// 			);
	// 		}
	// 	},
	// }).single("image");

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return next(new HttpError(err.message, 400));
		} else if (err) {
			return next(new HttpError(err.message, 406));
		}
		next();
	});
};

export const deleteAWSObject = (key: string) => {
	s3.deleteObject(
		{
			Bucket: process.env.AWS_BUCKET as string,
			Key: key,
		},
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);
};

export default uploadFile;
