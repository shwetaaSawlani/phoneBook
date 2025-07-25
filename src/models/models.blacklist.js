"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacklist = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BlacklistSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });
exports.Blacklist = mongoose_1.default.model("blacklist", BlacklistSchema);
