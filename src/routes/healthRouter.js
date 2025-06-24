import express from "express";
import { healthController } from "../controllers/healthController.js";

export const healthRouter = express.Router();

healthRouter.get("/", healthController);
