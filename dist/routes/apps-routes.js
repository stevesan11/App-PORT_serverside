"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_upload_1 = __importDefault(require("../middleware/file-upload"));
const apps_controllers_1 = require("../controllers/apps-controllers");
const check_auth_1 = require("../middleware/check-auth");
const router = express_1.default.Router();
router.get("/:appId", apps_controllers_1.getAppById);
router.get("/user/:userId", apps_controllers_1.getAppByUserId);
router.use(check_auth_1.checkJwtAuth);
router.post("/", file_upload_1.default, apps_controllers_1.createNewApp);
router.patch("/:appId", file_upload_1.default, apps_controllers_1.updateApp);
router.delete("/:appId", apps_controllers_1.deleteApp);
exports.default = router;
//# sourceMappingURL=apps-routes.js.map