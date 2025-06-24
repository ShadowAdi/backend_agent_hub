import { logger } from "../config/loggerConfig.js";

export const CustomErrorHandler = async (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error";
  logger.error(
    `Failed to get the error the status code is ${err.status} and the message is ${err.message}`
  );
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    success: false,
  });
};
