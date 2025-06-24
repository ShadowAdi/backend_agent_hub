import mongoose from "mongoose";
import { logger } from "../loggerConfig";

export const DBConnect = async (mongodb_uri) => {
  if (!mongodb_uri) {
    logger.error(`Failed to connect to DB. MongoDB uri is not provided`);
    console.log(`Failed to connect to DB. MongoDB uri is not provided`);
    return;
  }

  try {
    await mongoose.connect(mongodb_uri);
    logger.info(`Database connected`);
  } catch (error) {
    console.error("Failed to connect to the database", error);
    logger.error("Failed to connect to the database: " + error.message);
  }
};
