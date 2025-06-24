import mongoose from "mongoose";
import { JWT_SECRET } from "../config/envs.js";
import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const CheckAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startswith("Bearer ")) {
      const message = `Token not provided or invalid format. Header: ${authHeader}`;
      logger.error(message);
      return next(new AppError(message, 401));
    }

    const token = authHeader.split(" ")[1];
    if (!JWT_SECRET) {
      logger.error("JWT secret key not found.");
      return next(new AppError("Internal server error", 500));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!mongoose.Types.ObjectId.isValid(decoded.sub)) {
      logger.error(`Invalid user ID in token: ${decoded.sub}`);
      throw new AppError("Invalid user id", 401);
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Error in checking auth: " + error.message);
    return next(new AppError("Unauthorized access", 401));
  }
};
