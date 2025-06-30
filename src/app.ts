import express , { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN as string,
    credentials:true
}))

app.use(express.json({limit: "2mb"}))
app.use(express.urlencoded({extended:true, limit:"2mb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes

import contactRouter from './routes/routes.contact'
app.use("/api/v1/contact", contactRouter)

import userRouter from './routes/routes.User'
app.use("/api/v1/user", userRouter)


app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export {app}