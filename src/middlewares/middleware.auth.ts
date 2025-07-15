
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}


const verifyUserToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, "Access Denied / Unauthorized request: No token provided or invalid format.");
  }

  const token = authHeader.split(' ')[1];


  if (!token) { 
    throw new ApiError(401, "Access Denied / Unauthorized request: Token is missing.");
  }
  

    try{
    const verifiedUser = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload; 

    req.user = verifiedUser;

    console.log(verifiedUser);

   console.log("user is verfified");

   next();

    }catch(err){
      throw new ApiError(401, "Error during token verfication / user is unauthorized");
    }
 
});


export { verifyUserToken };