import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const validateUserSchema = (schema) => {
  return (req, res, next) => {
    for (let key in schema.paths) {
      if (["__v", "_id", "createdAt", "updatedAt"].includes(key)) continue;

      const rule = schema.paths[key].options;
      const value = req.body[key];

      if (rule.required && (value === undefined || value === null || value === "")) {
        logger.error(`Required field missing: ${key}`);
        return next(new AppError(`Required field missing: ${key}`, 400));
      }

      if (rule.type && value !== undefined && value !== null) {
        const expectedType = rule.type.name.toLowerCase();
        const actualType = typeof value;

        if (expectedType !== actualType) {
          logger.error(`Type mismatch: ${key} must be a ${expectedType}`);
          return next(new AppError(`Type mismatch: ${key} must be a ${expectedType}`, 400));
        }
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        logger.error(`${key} is invalid`);
        return next(new AppError(`${key} is invalid`, 400));
      }
    }

    next();
  };
};
