import { logger } from "../config/loggerConfig.js";

export const CustomErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  logger.error(
    `Failed to get the err the status code is ${err.status} and the message is ${err.message}`
  );
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    success: false,
  });
};
