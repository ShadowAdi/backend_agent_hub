import express from "express";
import {
  validateUserSchema,
  validateUserUpdateSchema,
} from "../validators/UserValidator.js";
import { UserSchema } from "../models/User.js";
import {
  DeleteUser,
  GetSingleUser,
  GetUsers,
  SignupUser,
  UpdateUser,
} from "../controllers/userController.js";
import { CheckAuth } from "../middlewares/CheckAuth.js";

export const UserRouter = express.Router();

UserRouter.post("/signup", validateUserSchema(UserSchema), SignupUser);
UserRouter.get("/user/:userId", GetSingleUser);
UserRouter.get("/", GetUsers);
UserRouter.delete("/", CheckAuth, DeleteUser);
UserRouter.patch(
  "/",
  validateUserUpdateSchema(UserSchema),
  CheckAuth,
  UpdateUser
);
