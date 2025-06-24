import express from "express";
import {
  CreateUserAgent,
  DeleteAgent,
  GetAgent,
  GetAllAgents,
  GetUserAgents,
} from "../controllers/agentController.js";
import { CheckAuth } from "../middlewares/CheckAuth.js";
import {
  AgentValidator,
  validateAgentUpdateSchema,
} from "../validators/AgentValidators.js";
import { AgentSchema } from "../models/Agent.js";
export const agentRouter = express.Router();

agentRouter.get("/", GetAllAgents);
agentRouter.get("/", CheckAuth, GetUserAgents);
agentRouter.get("/agent/:agentId", GetAgent);
agentRouter.post("/agent", AgentValidator, CheckAuth, CreateUserAgent);
agentRouter.delete("/agent/:agentId", CheckAuth, DeleteAgent);
agentRouter.patch(
  "/agent/:agentId",
  validateAgentUpdateSchema(AgentSchema),
  CheckAuth,
  DeleteAgent
);
