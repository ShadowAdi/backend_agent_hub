import express from "express";
import { validateUserSchema } from "../validators/UserValidator.js";
import { UserSchema } from "../models/User.js";

export const UserRouter = express.Router();

UserRouter.post("/signup", validateUserSchema(UserSchema));
