import { JWT_SECRET } from "../config/envs.js";
import { logger } from "../config/loggerConfig.js";
import { AppError } from "./AppError.js";
import jwt from "jsonwebtoken";

export const TokenGenerator = async (payload) => {
  if (!JWT_SECRET) {
    console.log("Jwt Secret Key is not found ", Jwt_Secret);
    logger.error("Jwt Secret Key is not found " + Jwt_Secret);
    return next(new AppError(`Internal Server Error`, 500));
  }
  try {
    const token =  jwt.sign(payload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log("Server Error in creating Token ", error);
    logger.error("Error in creating Token  " + error);
    return next(new AppError(`Internal Server Error`, 500));
  }
};
