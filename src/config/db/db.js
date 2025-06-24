import mongoose from "mongoose";
import { logger } from "../loggerConfig.js";
import { AppError } from "../../utils/AppError.js";
import { mongodb_uri } from "../envs.js";

export const DBConnect = async () => {
  if (!mongodb_uri) {
    logger.error(`Failed to connect to DB. MongoDB uri is not provided`);
    console.log(`Failed to connect to DB. MongoDB uri is not provided`);
    throw new AppError(`Internal Server Error: DB URL is undefined`, 500);
  }

  try {
    await mongoose.connect(mongodb_uri);
    logger.info(`Database connected`);
  } catch (error) {
    console.error("Failed to connect to the database", error);
    logger.error("Failed to connect to the database: " + error.message);
    throw new AppError(`Internal Server Error: DB URL is undefined`, 500);
  }
};
