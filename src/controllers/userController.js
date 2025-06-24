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

export const GetUsers = CustomTryCatch(async (req, res, next) => {
  const users = await UserModel.find().select("-password");

  return res.status(200).json({
    success: true,
    users,
    noOfUsers:users.length
  });
});

export const DeleteUser = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  const { sub, email } = user;

  if (!user || !email || !sub) {
    logger.error(`Failed to get the authenticated user`);
    return next(new AppError(`Failed to get the authenticated user`, 404));
  }

  const userFound = await UserModel.findById(sub).select("-password");
  if (!userFound) {
    logger.error(`User With Id Does Not Exist: ${sub}`);
    return next(new AppError(`User With Id Does Not Exist: ${sub}`, 404));
  }

  // Use .equals() to compare ObjectIds safely
  if (!userFound._id.equals(sub)) {
    logger.error(`Only the authenticated user can delete their account`);
    return next(
      new AppError(`Only the authenticated user can delete their account`, 403)
    );
  }

  await UserModel.findByIdAndDelete(userFound._id);

  return res.status(200).json({
    message: "User is deleted",
    success: true,
  });
});
