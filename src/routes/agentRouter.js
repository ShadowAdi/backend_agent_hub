import express from "express";
import {
  GetAgent,
  GetAllAgents,
  GetUserAgents,
} from "../controllers/agentController.js";
import { CheckAuth } from "../middlewares/CheckAuth.js";
export const agentRouter = express.Router();

agentRouter.get("/", GetAllAgents);
agentRouter.get("/", CheckAuth, GetUserAgents);
agentRouter.get("/agent/:agentId", GetAgent);
