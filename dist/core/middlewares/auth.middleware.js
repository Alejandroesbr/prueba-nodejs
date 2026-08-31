"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/middlewares/auth.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const custom_error_1 = require("../errors/custom.error");
const jwt_util_1 = require("../utils/jwt.util");
/**
 * Authentication Middleware:
 * The API's first line of defense. It validates that the HTTP request includes
 * a valid JWT in the headers before allowing access to protected routes.
 */
const authenticate = (req, _res, next) => {
    try {
        // 1. Read the header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new custom_error_1.UnauthorizedError("An access token was not provided in the headers.");
        }
        // 2. Validate format (RFC 6750)
        if (!authHeader.startsWith("Bearer ")) {
            throw new custom_error_1.UnauthorizedError("Invalid token format. The expected format is: Bearer <token>");
        }
        // 3. Isolate the chain token, we cut the 7 first characters
        const token = authHeader.substring(7);
        // 4. if the firm is not valid or expire, jwt.util throw a sync error
        const decodedPayload = (0, jwt_util_1.verifyToken)(token);
        // 5. Join the payload to req.user (save in the memory session)
        req.user = decodedPayload;
        // 6. give the control to the next middleware or controller
        next();
    }
    catch (error) {
        // extra: Capture
        /** If the error is a instance form UnauthorizedError, allowed
         * if the error is a library jsonwebtoken we transform to UnauthorizedError
         * to be able to filter the technical details  */
        if (error instanceof custom_error_1.UnauthorizedError) {
            next(error);
        }
        else {
            next(new custom_error_1.UnauthorizedError("Access denied: The token is invalid, has been modified, or has expired."));
        }
    }
};
exports.authenticate = authenticate;
