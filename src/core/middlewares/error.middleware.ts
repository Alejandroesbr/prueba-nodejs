// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/middlewares/error.middleware.ts

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ENV } from  '../config/env.config';
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
 * Centralized middleware for capturing and sanitizing errors.
 * NOTE: The 4-parameter signature (err, req, res, next) is REQUIRED for
 * Express to recognize the function as an error handler.
 */
export const  errorMiddleware ErrorRequestHandler = (
    err: Error,
    req: Request,
    // eslint-disable-next-line
    next: NextFunction,
): void => {
    // 1. Manage de value by default (fail not control -> 500 Internal Error)
    let statusCode = 500;
    let errorCode = "INTERNAL_ERROR";
    let message = "Internal error from the server"

    // if the error is a instance from CustomeError, get the Metadata
    if (err instanceof CustomeError) {
        statusCode = err.statusCode;
        errorCode = err.errorCode;
        message = err.message; 
    } else if (err.name === "SequelizeUniqueConstraintErro")
}
