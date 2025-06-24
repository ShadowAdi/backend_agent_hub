import express from "express";
import { SigninUser } from "../controllers/authController.js";
import { AuthValidator } from "../validators/AuthValidator.js";

export const authRouter = express.Router();

authRouter.post("/signin", AuthValidator, SigninUser);

