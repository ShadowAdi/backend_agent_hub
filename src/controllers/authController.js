import { logger } from "../config/loggerConfig.js";
import { UserModel } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import bcrypt from "bcrypt";
import { TokenGenerator } from "../utils/TokenGenerator.js";

export const SigninUser = CustomTryCatch(async (req, res, next) => {
  const isUserExist = await UserModel.findOne({ email: req.body.email });
  if (!isUserExist) {
    logger.error(`User not exists with the mail: ${email}`);
    return next(new AppError(`User not exists with the mail: ${email}`, 404));
  }
  const bodyPassword = req.body.password;
  const isCorrectPassword = await bcrypt.compare(
    bodyPassword,
    isUserExist.password
  );
  if (!isCorrectPassword) {
    logger.error(
      `Invalid Credentails.  Email: ${email} and password: ${bodyPassword}`
    );
    return next(
      new AppError(
        `Invalid Credentails.  Email: ${email} and password: ${bodyPassword}`,
        404
      )
    );
  }

  const payload = {
    email: isUserExist.email,
    sub: isUserExist._id,
  };
  const { password, ...user } = isUserExist;
  const token = await TokenGenerator(payload);
  return res.status(200).json({
    token,
    message: "Login Successfull",
    success: true,
    user,
  });
});

export const GetUser = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    logger.error(`Failed to get the authenticated user ${user}`);
    console.log(`Failed to get the authenticated user ${user}`);
    return next(
      new AppError(`Failed to get the authenticated user ${user}`, 404)
    );
  }

  const { email, sub } = user;

  if (!email || !sub) {
    logger.error(`Failed to get the authenticated user ${sub}`);
    console.log(`Failed to get the authenticated user ${sub}`);
    return next(
      new AppError(`Failed to get the authenticated user ${sub}`, 404)
    );
  }

  const userFound = await UserModel.findById(sub).select("-password");
  if (!userFound) {
    logger.error(`User With Id Do Not Exist: ${sub}`);
    console.log(`User With Id Do Not Exist: ${sub}`);
    return next(new AppError(`User With Id Do Not Exist: ${sub}`, 404));
  }
  return res.status(200).json({
    success: true,
    user: userFound,
  });
});
