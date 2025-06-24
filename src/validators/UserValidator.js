import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const validateUserSchema = (schema) => {
  return (req, res, next) => {
    for (let key in schema.paths) {
      const rule = schema.paths[key].options;
      const value = req.body[key];

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        logger.error(
          `Required Data is not Present. ,${key} this field is missing`
        );
        return next(
          new AppError(
            `Required Data is not Present. ,${key} this field is missing`,
            400
          )
        );
      }

      if (rule.type && value !== undefined && value !== null) {
        const expectedType = rule.type.name.toLowerCase();
        const actualType = typeof value;
        if (expectedType !== actualType) {
          logger.error(`Type mismatch: ${key} must be a ${expectedType}`);
          return next(
            new AppError(`Type mismatch: ${key} must be a ${expectedType}`, 400)
          );
        }
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        logger.error(`Type is not correct. ,${key} must be a ${rule.type}`);
        return next(new AppError(`${key} is invalid. ,${key} is invalid`, 400));
      }
    }
    next();
  };
};
