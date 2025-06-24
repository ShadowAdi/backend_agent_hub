import express from "express";
import { GetAgent, GetAllAgents } from "../controllers/agentController";
export const agentRouter = express.Router();

agentRouter.get("/", GetAllAgents);
agentRouter.get("/", GetAllAgents);
agentRouter.get("/agent/:agentId", GetAgent);
