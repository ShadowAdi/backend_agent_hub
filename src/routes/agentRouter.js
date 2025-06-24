import express from "express";
import {
  CreateUserAgent,
  DeleteAgent,
  GetAgent,
  GetAllAgents,
  GetUserAgents,
} from "../controllers/agentController.js";
import { CheckAuth } from "../middlewares/CheckAuth.js";
import { AgentValidator } from "../validators/AgentValidators.js";
export const agentRouter = express.Router();

agentRouter.get("/", GetAllAgents);
agentRouter.get("/", CheckAuth, GetUserAgents);
agentRouter.get("/agent/:agentId", GetAgent);
agentRouter.post("/agent", AgentValidator, CheckAuth, CreateUserAgent);
agentRouter.delete("/agent/:agentId",CheckAuth, DeleteAgent);
agentRouter.patch("/agent/:agentId",CheckAuth, DeleteAgent);

