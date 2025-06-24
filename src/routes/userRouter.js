import express from "express";
import { validateUserSchema } from "../validators/UserValidator.js";
import { UserSchema } from "../models/User.js";
import { DeleteUser, GetSingleUser, SignupUser } from "../controllers/userController.js";
import { CheckAuth } from "../middlewares/CheckAuth.js";

export const UserRouter = express.Router();

UserRouter.post("/signup", validateUserSchema(UserSchema), SignupUser);
UserRouter.get("/user/:userId", GetSingleUser);
UserRouter.delete("/", CheckAuth,DeleteUser);


