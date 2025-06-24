import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const healthController = (res) => {
  try {
    return res.status(200).json({
      message: "Health API Is working",
      success: true,
    });
  } catch (error) {
    console.error(
      `Internal Server Errror: ${error}. Failed to get the Health Api.`
    );
    logger.error(
      `Internal Server Errror: ${error}. Failed to get the Health Api.`
    );
    throw new AppError(`Internal Server Errror: ${error}`, 500);
  }
};
