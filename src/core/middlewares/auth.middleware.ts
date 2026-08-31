// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/middlewares/auth.middleware.ts

import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/custom.error";
import { JwtPayload, verifyToken } from "../utils/jwt.util";

/**
 * DECLARATION MERGING (Global Type Extension)
 * Express doesn't know that our ‘Request’ can have a ‘user’ property.
 * With this block, we inject the ‘user’ property of type ‘JwtPayload’
 * into the Express Request interface globally. This enables
 * autocompletion and prevents TypeScript compiler errors in the controllers.
 */

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Authentication Middleware:
 * The API's first line of defense. It validates that the HTTP request includes
 * a valid JWT in the headers before allowing access to protected routes.
 */

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        // 1. Read the header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedError("An access token was not provided in the headers.");
        }
        // 2. Validate format (RFC 6750)
        if (!authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Invalid token format. The expected format is: Bearer <token>");
        }
        // 3. Isolate the chain token, we cut the 7 first characters
        const token = authHeader.substring(7);
        // 4. if the firm is not valid or expire, jwt.util throw a sync error
        const decodedPayload = verifyToken(token);
        // 5. Join the payload to req.user (save in the memory session)
        req.user = decodedPayload;
        // 6. give the control to the next middleware or controller
        next();
    } catch (error) {
        // extra: Capture
        /** If the error is a instance form UnauthorizedError, allowed
         * if the error is a library jsonwebtoken we transform to UnauthorizedError
         * to be able to filter the technical details  */
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError("Access denied: The token is invalid, has been modified, or has expired."));
        }
    }
};
