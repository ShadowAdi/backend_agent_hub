import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const AuthValidator = async (req, res, next) => {
  const { email, password } = req.body;

  if (
    email === undefined ||
    email === null ||
    email === "" ||
    password === undefined ||
    password === null ||
    password === ""
  ) {
    logger.error(`Required field missing`);
    return next(new AppError(`Required field missing`, 400));
  }

  if (typeof email !== "string" && typeof password !== "string") {
    logger.error(`Invalid Data`);
    return next(new AppError(`Invalid Data`, 400));
  }

  next();
};
