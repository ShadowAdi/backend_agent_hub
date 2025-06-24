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



export const validateAgentUpdateSchema = (schema) => {
  return (req, res, next) => {
    for (let key in req.body) {
      // Skip invalid or immutable fields
      if (!schema.paths[key] || ["__v", "_id", "createdAt", "updatedAt"].includes(key)) continue;

      const rule = schema.paths[key].options;
      const value = req.body[key];

      // Type checking
      if (rule.type && value !== undefined && value !== null) {
        let expectedType = "";
        if (Array.isArray(rule.type)) {
          expectedType = "array";
        } else if (typeof rule.type === "function" && rule.type.name) {
          expectedType = rule.type.name.toLowerCase();
        } else {
          expectedType = typeof rule.default;
        }

        const actualType = Array.isArray(value) ? "array" : typeof value;

        if (expectedType !== actualType) {
          logger.error(`Type mismatch: '${key}' must be a ${expectedType}`);
          return next(new AppError(`Type mismatch: '${key}' must be a ${expectedType}`, 400));
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        logger.error(`Invalid value for '${key}'. Allowed: ${rule.enum.join(", ")}`);
        return next(
          new AppError(`'${key}' must be one of: ${rule.enum.join(", ")}`, 400)
        );
      }

      // Min/Max validation for numbers
      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          return next(new AppError(`'${key}' must be at least ${rule.min}`, 400));
        }
        if (rule.max !== undefined && value > rule.max) {
          return next(new AppError(`'${key}' must be at most ${rule.max}`, 400));
        }
      }

      // Optional: regex / pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        logger.error(`Invalid pattern for '${key}'`);
        return next(new AppError(`Invalid pattern for '${key}'`, 400));
      }
    }

    next();
  };
};
