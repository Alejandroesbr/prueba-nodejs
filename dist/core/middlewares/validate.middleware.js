"use strict";
// api-riwimedicare/src/core/middlewares/validate.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const custom_error_1 = require("../errors/custom.error");
/**
 * Default configuration options for Joi validations.
 */
const joiValidationOptions = {
    // Collect all errors from the request instead of stopping at the first one
    abortEarly: false,
    // Removes properties not explicitly declared in the schema (Prevents mass assignment)
    stripUnknown: true,
};
/**
 * Higher-order middleware factory that validates the request body (req.body)
 * against a predefined Joi schema.
 *
 * @param schema - Joi validation schema (ObjectSchema).
 * @returns Standard Express middleware (req, res, next).
 */
const validateMiddleware = (schema) => {
    return (req, res, next) => {
        // Validates the request body against the Joi schema
        const { error, value } = schema.validate(req.body, joiValidationOptions);
        if (error) {
            // Maps and normalizes Joi error details for the API response
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message.replace(/['"]/g, ""),
            }));
            // We create a BadRequestError indicating the syntax validation errors
            const validationError = new custom_error_1.BadRequestError("Errors in the validation of input data");
            // We attach the structured details to the error object so they can be used by error.middleware.ts
            validationError.details = errorDetails;
            return next(validationError);
        }
        // If validation is successful, replace req.body with the transformed and sanitized object
        req.body = value;
        // Pass control to the next middleware or controller in the route
        return next();
    };
};
exports.validateMiddleware = validateMiddleware;
