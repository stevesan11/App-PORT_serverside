"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAWSObject = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const uuid_1 = require("uuid");
const http_error_1 = __importDefault(require("../model/http-error"));
require("dotenv/config");
aws_sdk_1.default.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new aws_sdk_1.default.S3();
const uploadFile = (req, res, next) => {
    const MIME_TYPE = {
        "image/png": "png",
        "image/jpg": "jpg",
        "image/jpeg": "jpeg",
    };
    const upload = (0, multer_1.default)({
        limits: { fileSize: 1024 * 1024 * 5 },
        storage: (0, multer_s3_1.default)({
            s3: s3,
            bucket: process.env.AWS_BUCKET,
            acl: "public-read",
            key: function (req, file, cb) {
                const ext = MIME_TYPE[file.mimetype];
                cb(null, (0, uuid_1.v4)() + "." + ext);
            },
        }),
        fileFilter(req, file, cb) {
            const isValid = file.mimetype in MIME_TYPE;
            if (isValid) {
                cb(null, true);
            }
            else {
                cb(new Error("File extensions provided are not allowed please provide in .png/.jpg/.jpeg file"));
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
        if (err instanceof multer_1.default.MulterError) {
            return next(new http_error_1.default(err.message, 400));
        }
        else if (err) {
            return next(new http_error_1.default(err.message, 406));
        }
        next();
    });
};
const deleteAWSObject = (key) => {
    s3.deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });
};
exports.deleteAWSObject = deleteAWSObject;
exports.default = uploadFile;
//# sourceMappingURL=file-upload.js.map