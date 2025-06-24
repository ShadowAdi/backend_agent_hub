import { logger } from "../config/loggerConfig.js";
import { AgentModel } from "../models/Agent.js";
import { AppError } from "../utils/AppError.js";
import { IsUserExist } from "../utils/AuthCheck.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";

export const GetAllAgents = CustomTryCatch(async (req, res) => {
  const agents = await AgentModel.find()
    .sort({ createdAt: -1 })
    .populate("userId name email profilePic");
  return res.status(200).json({
    success: true,
    agents,
    agentCounts: agents.length,
  });
});

export const GetAgent = CustomTryCatch(async (req, res) => {
  const { agentId } = req.params;
  const isAgentExist = await AgentModel.findById(agentId).populate(
    "userId name email profilePic"
  );
  if (!isAgentExist) {
    logger.error(`Agent With Id Do Not Exist: ${agentId}`);
    console.log(`Agent With Id Do Not Exist: ${agentId}`);
    return next(new AppError(`Agent With Id Do Not Exist: ${agentId}`, 404));
  }
  return res.status(200).json({
    success: true,
    isAgentExist,
  });
});

export const GetUserAgents = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  const { sub, email } = user;

  const loggedInUser = await IsUserExist(user, email, sub, next);
  const userAgents = await AgentModel.find({ userId: loggedInUser._id });
  return res.status(200).json({
    userAgents,
    success: true,
    agentCounts: userAgents.length,
  });
});
