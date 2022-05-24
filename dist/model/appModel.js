"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appSchema = new mongoose_1.Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 30 },
    description: { type: String, required: true, minlength: 10, maxlength: 300 },
    image: { type: String, required: true },
    url: { type: String, required: true, minlength: 13, maxlength: 2083 },
    author: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
});
const App = (0, mongoose_1.model)("App", appSchema);
exports.default = App;
//# sourceMappingURL=appModel.js.map