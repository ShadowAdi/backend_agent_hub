import { GEMINI_SECRET_KEY } from "../config/envs.js";
import { logger } from "../config/loggerConfig.js";
import { AgentModel } from "../models/Agent.js";
import { ChatModel } from "../models/Chat.js";
import { MessageModel } from "../models/Message.js";
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
  const userAgents = await AgentModel.find({ userId: loggedInUser._id })
    .sort({ createdAt: -1 })
    .populate("userId name email profilePic");

  return res.status(200).json({
    userAgents,
    success: true,
    agentCounts: userAgents.length,
  });
});

export const CreateUserAgent = CustomTryCatch(async (req, res, next) => {
  const data = req.body;
  const user = req.user;
  const { sub, email } = user;

  const loggedInUser = await IsUserExist(user, email, sub, next);
  const isAgentExist = await AgentModel.findOne({
    name: data.name,
    userId: loggedInUser._id,
  });
  if (isAgentExist) {
    logger.error(`Agent With Same Name already Exists`);
    return next(new AppError(`Agent With Same Name already Exists`, 404));
  }

  data.userId = loggedInUser._id;
  if (!GEMINI_SECRET_KEY) {
    logger.error(`Api Key is neither provided not exist in default`);
    return next(
      new AppError(`Api Key is neither provided not exist in default`, 404)
    );
  }
  data.apiKey = GEMINI_SECRET_KEY;

  const createdAgent = await AgentModel(data);
  let newChatModel;

  await createdAgent.save();
  if (data.type === "chat") {
    newChatModel = new ChatModel.create({
      agentId: createdAgent._id,
      userId: loggedInUser._id,
      title: `${data.name} Chat`,
    });
    await newChatModel.save();
  }
  return res.status(201).json({
    message: "Agent Is Created",
    createdAgent,
    success: true,
    chatId: newChatModel,
  });
});

export const DeleteAgent = CustomTryCatch(async (req, res, next) => {
  const { sub, email } = req.user;
  const { agentId } = req.params;

  const loggedInUser = await IsUserExist(req.user, email, sub, next);

  const isAgentExist = await AgentModel.findById(agentId).populate("userId");

  if (!isAgentExist) {
    return next(new AppError("Agent not found", 404));
  }

  if (isAgentExist.userId.toString() !== loggedInUser._id.toString()) {
    logger.error(
      `You are not the creator of this agent. Creator email: ${isAgentExist.userId.email}, Logged-in user email: ${email}`
    );
    return next(
      new AppError(
        `You are not the creator of this agent. Creator email: ${isAgentExist.userId.email}, Logged-in user email: ${email}`,
        403
      )
    );
  }

  const chats = await ChatModel.find({ agentId });

  const chatIds = chats.map((chat) => chat._id);

  await MessageModel.deleteMany({ chatId: { $in: chatIds } });

  await ChatModel.deleteMany({ agentId });

  await AgentModel.findByIdAndDelete(agentId);

  return res.status(200).json({
    message: "Agent, its chats, and related messages have been deleted.",
    success: true,
  });
});
