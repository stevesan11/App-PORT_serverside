"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_auth_1 = require("../middleware/check-auth");
const file_upload_1 = __importDefault(require("../middleware/file-upload"));
const user_controllers_1 = require("../controllers/user-controllers");
const router = express_1.default.Router();
router.get("/", user_controllers_1.getAllUsers);
router.post("/signup", file_upload_1.default, user_controllers_1.signup);
router.post("/login", check_auth_1.checkLocalAuth, user_controllers_1.login);
exports.default = router;
//# sourceMappingURL=users-routes.js.map