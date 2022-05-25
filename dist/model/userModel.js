"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    image: { type: String, required: true },
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, unique: true, minlength: 6, maxlength: 320 },
    password: { type: String, required: true, minlength: 8, maxlength: 60 },
    apps: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "App" }],
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map