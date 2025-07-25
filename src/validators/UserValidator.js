import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const validateUserSchema = (schema) => {
  return (req, res, next) => {
    for (let key in schema.paths) {
      if (["__v", "_id", "createdAt", "updatedAt"].includes(key)) continue;

      const rule = schema.paths[key].options;
      const value = req.body[key];

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        logger.error(`Required field missing: ${key}`);
        return next(new AppError(`Required field missing: ${key}`, 400));
      }

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
          logger.error(`Type mismatch: ${key} must be a ${expectedType}`);
          return next(
            new AppError(`Type mismatch: ${key} must be a ${expectedType}`, 400)
          );
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


export const validateUserUpdateSchema = (schema) => {
  return (req, res, next) => {
    for (let key in req.body) {
      if (!schema.paths[key] || ["__v", "_id", "createdAt", "updatedAt"].includes(key)) continue;

      const rule = schema.paths[key].options;
      const value = req.body[key];

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
          logger.error(`Type mismatch: ${key} must be a ${expectedType}`);
          return next(
            new AppError(`Type mismatch: ${key} must be a ${expectedType}`, 400)
          );
        }
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        logger.error(`${key} is invalid`);
        return next(new AppError(`${key} is invalid`, 400));
      }

      if (rule.enum && !rule.enum.includes(value)) {
        logger.error(`${key} must be one of: ${rule.enum.join(", ")}`);
        return next(new AppError(`${key} must be one of: ${rule.enum.join(", ")}`, 400));
      }

      if (typeof value === "number") {
        if (rule.min && value < rule.min[0]) {
          return next(new AppError(`${key} must be at least ${rule.min[0]}`, 400));
        }
        if (rule.max && value > rule.max[0]) {
          return next(new AppError(`${key} must be at most ${rule.max[0]}`, 400));
        }
      }
    }

    next();
  };
};