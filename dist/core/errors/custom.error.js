"use strict";
// \Users\alejandro\developer\prueba-nodejs\src\core\errors\custom.error.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.CustomeError = void 0;
/**
 * Base class for known operational errors within the application.
 */
class CustomeError extends Error {
    constructor(message) {
        super(message);
        // Restore prototype to maintain the inheritance chain in TS
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.CustomeError = CustomeError;
/**
 * Exception for input validation errors or syntactically incorrect data (HTTP 400).
 */
class BadRequestError extends CustomeError {
    statusCode = 400;
    errorCode = "BAD_REQUEST";
    constructor(message = "incorrect request") {
        super(message);
    }
}
exports.BadRequestError = BadRequestError;
/**
 * Exception for resources not found in the database (HTTP 404).
 */
class NotFoundError extends CustomeError {
    statusCode = 404;
    errorCode = "NOT_FOUND";
    constructor(message = "resource not found") {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Exception for authentication errors (HTTP 401).
 */
class UnauthorizedError extends CustomeError {
    statusCode = 401;
    errorCode = "UNAUTHORIZED";
    constructor(message = "unauthorized") {
        super(message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * Exception for unauthorized access to resources/paths due to lack of permissions (HTTP 403).
 */
class ForbiddenError extends CustomeError {
    statusCode = 403;
    errorCode = "FORBIDDEN";
    constructor(message = "Access denied: You do not have the necessary permissions") {
        super(message);
    }
}
exports.ForbiddenError = ForbiddenError;
