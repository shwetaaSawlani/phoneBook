"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = "Something Went Wrong", error = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = error;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this);
        }
    }
}
exports.ApiError = ApiError;
