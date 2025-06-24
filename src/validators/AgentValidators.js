import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const AgentValidator = async (req, res, next) => {
  const {
    name,
    description,
    type,
    modelProvider,
    prompt,
    temperature,
  } = req.body;

  if (!name || !description || !prompt) {
    logger.error("Required field(s) missing: name, description, or prompt");
    return next(new AppError("Required field(s) missing", 400));
  }

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof prompt !== "string"
  ) {
    logger.error("Invalid type for name, description, or prompt");
    return next(new AppError("Invalid data types for required fields", 400));
  }

  const allowedTypes = ["task", "chat"];
  const allowedProviders = ["gemini", "huggingface", "openrouter"];

  if (type && !allowedTypes.includes(type)) {
    logger.error(`Invalid type value: ${type}`);
    return next(new AppError("Invalid type. Allowed: task, chat", 400));
  }

  if (modelProvider && !allowedProviders.includes(modelProvider)) {
    logger.error(`Invalid model provider: ${modelProvider}`);
    return next(new AppError("Invalid model provider", 400));
  }

  if (
    temperature !== undefined &&
    (typeof temperature !== "number" || temperature < 0 || temperature > 1)
  ) {
    logger.error(`Temperature must be a number between 0 and 1`);
    return next(new AppError("Invalid temperature range", 400));
  }

  next();
};
