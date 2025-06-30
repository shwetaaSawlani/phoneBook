"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const db_1 = __importDefault(require("./db/db"));
const app_1 = require("./app");
(0, db_1.default)()
    .then(() => {
    app_1.app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log("MongoDb coonection fail !!!!", err);
});
