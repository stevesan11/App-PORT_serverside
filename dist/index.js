"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const check_auth_1 = __importDefault(require("./middleware/check-auth"));
const helmet_1 = __importDefault(require("helmet"));
// import cors from "cors";
require("dotenv/config");
const users_routes_1 = __importDefault(require("./routes/users-routes"));
const apps_routes_1 = __importDefault(require("./routes/apps-routes"));
const file_upload_1 = require("./middleware/file-upload");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
// app.use(
// 	cors({
// 		origin: process.env.FRONT_URL,
// 		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
// 		methods: ["GET", "POST", "PATCH", "DELETE"],
// 		optionsSuccessStatus: 200,
// 	})
// );
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(check_auth_1.default.initialize());
// app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(express_1.default.static(path_1.default.join(__dirname, "client")));
app.use("/api/user", users_routes_1.default);
app.use("/api/app", apps_routes_1.default);
//index.html redirectt rewritecofig
app.use((req, res) => {
    res.sendFile(path_1.default.join(__dirname, "client", "index.html"));
});
app.use((err, req, res, next) => {
    const file = req.file;
    if (file) {
        (0, file_upload_1.deleteAWSObject)(file.key);
    }
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.errorCode || 500).json({ message: err.message || "An unknown error occured" });
    throw err;
});
mongoose_1.default
    .connect(`mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster0.seh7p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
    app.listen(process.env.PORT || 3030);
    console.log("Processing on port 3030");
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map