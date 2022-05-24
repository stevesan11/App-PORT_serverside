"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    errorCode;
    constructor(message, errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
exports.default = HttpError;
//# sourceMappingURL=http-error.js.map