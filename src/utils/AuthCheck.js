import { logger } from "../config/loggerConfig.js";
import { UserModel } from "../models/User.js";
import { AppError } from "./AppError.js";

export const IsUserExist = async (user, email, sub,next) => {
  try {
    if (!user || !email || !sub) {
      logger.error(`Failed to get the authenticated user`);
      return next(new AppError(`Failed to get the authenticated user`, 404));
    }

    const userFound = await UserModel.findById(sub).select("-password");
    if (!userFound) {
      logger.error(`User With Id Does Not Exist: ${sub}`);
      return next(new AppError(`User With Id Does Not Exist: ${sub}`, 404));
    }

    if (!userFound._id.equals(sub)) {
      logger.error(`Only the authenticated user can delete their account`);
      return next(
        new AppError(
          `Only the authenticated user can delete their account`,
          403
        )
      );
    }
    return userFound;
  } catch (error) {
    logger.error(`Failed to check for that f user exists or not: ${error}`);
    return next(
      new AppError(
        `Failed to check for that f user exists or not: ${error}`,
        404
      )
    );
  }
};
