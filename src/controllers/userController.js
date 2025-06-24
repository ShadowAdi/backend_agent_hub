import { logger } from "../config/loggerConfig.js";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import bcrypt from "bcrypt";

export const SignupUser = CustomTryCatch(async (req, res, next) => {
  const isUserExist = await UserModel.findOne({ email: req.body.email });
  if (isUserExist) {
    logger.error(`User already exists with the mail: ${email}`);
    return next(
      new AppError(`User already exists with the mail: ${email}`, 404)
    );
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  const newUser = new UserModel(req.body);
  await newUser.save();
  logger.info(`User is created`);
  return res.status(201).json({
    message: `User is created`,
    success: true,
  });
});

export const GetSingleUser = CustomTryCatch(async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    logger.error(`Failed to get the userId ${userId}`);
    console.log(`Failed to get the userId ${userId}`);
    return next(new AppError(`Failed to get the userId ${userId}`, 404));
  }
  const isUserExist = await UserModel.findById(userId).select("-password");
  if (!isUserExist) {
    logger.error(`User With Id Do Not Exist: ${sub}`);
    console.log(`User With Id Do Not Exist: ${sub}`);
    return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
  }
  return res.status(200).json({
    success: true,
    isUserExist,
  });
});

export const DeleteUser = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user || !user.email || !user.sub) {
    logger.error(`Failed to get the authenticated user ${user}`);
    console.log(`Failed to get the authenticated user ${user}`);
    return next(
      new AppError(`Failed to get the authenticated user ${user}`, 404)
    );
  }

  const userFound = await UserModel.findById(user.sub).select("-password");
  if (!userFound) {
    logger.error(`User With Id Do Not Exist: ${sub}`);
    console.log(`User With Id Do Not Exist: ${sub}`);
    return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
  }

  if (userFound._id !== sub) {
    logger.error(`Only Authenticated User can delete his account`);
    console.log(`Only Authenticated User can delete his account`);
    return next(
      new AppError(`Only Authenticated User can delete his account`, 404)
    );
  }

  await UserModel.findByIdAndDelete(userFound._id);
  return res.status(200).json({
    message: "User is deleted",
    success: true,
  });
});
