import express from "express";
import { GetUser, SigninUser } from "../controllers/authController.js";
import { AuthValidator } from "../validators/AuthValidator.js";
import { CheckAuth } from "../middlewares/CheckAuth.js";

export const authRouter = express.Router();

authRouter.post("/signin", AuthValidator, SigninUser);
authRouter.get("/me", CheckAuth, GetUser);

