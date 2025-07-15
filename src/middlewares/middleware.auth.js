"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = void 0;
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyUserToken = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError_1.ApiError(401, "Access Denied / Unauthorized request: No token provided or invalid format.");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError_1.ApiError(401, "Access Denied / Unauthorized request: Token is missing.");
    }
    try {
        const verifiedUser = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        req.user = verifiedUser;
        console.log(verifiedUser);
        console.log("user is verfified");
        next();
    }
    catch (err) {
        throw new ApiError_1.ApiError(401, "Error during token verfication / user is unauthorized");
    }
}));
exports.verifyUserToken = verifyUserToken;
