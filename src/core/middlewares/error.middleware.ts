// src/core/middlewares/error.middleware.ts

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ENV } from "../config/env.config";
import { CustomeError } from "../errors/custom.error";

/**
 * Interface that defines the unified JSON structure for error responses.
 */
interface ErrorResponse {
    success: boolean;
    message: string;
    code: string;
    stack?: string;
}

/**
 * Centralized middleware for error capture and sanitization.
 * NOTE: The 4-parameter signature (err, req, res, next) is REQUIRED for
 * Express to recognize the function as an error handler.
 */
export const errorMiddleware: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    // 1. Handling Default Values (Unhandled Exceptions -> 500 Internal Error)
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let message = "An internal server error has occurred";

    // If the error is an instance of our CustomError hierarchy, we retrieve its metadata
    if (err instanceof CustomeError) {
        statusCode = err.statusCode;
        errorCode = err.errorCode;
        message = err.message;
    } else if (err.name === "SequelizeUniqueConstraintError") {
        // Optional handling of common ORM errors
        statusCode = 409;
        errorCode = "CONFLICT_ERROR";
        message = "The resource or record already exists in the system";
    }

    // 2. Event Logging (Logging to stdout / server console)
    console.error(`[Error] ${req.method} ${req.originalUrl} | Status: ${statusCode} | Message: ${err.message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    // 3. Building the Response Based on the Environment (Development vs. Production)
    const isDevelopment = ENV.NODE_ENV === "development";

    const responseBody: ErrorResponse = {
        success: false,
        // In production, unhandled native 500 error messages are hidden
        message: isDevelopment ? err.message : statusCode === 500 ? "An internal server error has occurred" : message,
        code: errorCode,
        // The stack trace is displayed ONLY if we are explicitly in a development environment
        ...(isDevelopment && { stack: err.stack }),
    };

    // 4. Send the HTTP response with parameters
    res.status(statusCode).json(responseBody);
};
