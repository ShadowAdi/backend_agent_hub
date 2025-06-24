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
    user
  });
});

export const GetUser = CustomTryCatch(async (req, res, next) => {
 
});
