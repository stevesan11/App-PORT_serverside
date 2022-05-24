"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const http_error_1 = __importDefault(require("../model/http-error"));
const uploadFile = (req, res, next) => {
    const MIME_TYPE = {
        "image/png": "png",
        "image/jpeg": "jpg",
    };
    const upload = (0, multer_1.default)({
        limits: { fileSize: 1024 * 1024 * 5 },
        storage: multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./uploads/images");
            },
            filename: function (req, file, cb) {
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
exports.default = uploadFile;
//# sourceMappingURL=file-upload.js.map