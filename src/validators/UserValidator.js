import { logger } from "../config/loggerConfig.js";
import { AppError } from "../utils/AppError.js";

export const validateUserSchema = (schema) => {
  return (req, res, next) => {
    for (let key in schema) {
      const rule = schema[key];
      const value = req.body[key];

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        logger.error(
          `Required Data is not Present. ,${key} this field is missing`
        );
        return next(
          AppError(
            `Required Data is not Present. ,${key} this field is missing`,
            400
          )
        );
      }

      if (rule.type && typeof value !== rule.type) {
        logger.error(`Type is not correct. ,${key} must be a ${rule.type}`);
        return next(
          AppError(`Type is not correct. ,${key} must be a ${rule.type}`, 400)
        );
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        logger.error(`Type is not correct. ,${key} must be a ${rule.type}`);
        return next(AppError(`${key} is invalid. ,${key} is invalid`, 400));
      }
    }
    next();
  };
};
