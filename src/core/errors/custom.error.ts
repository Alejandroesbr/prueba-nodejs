// \Users\alejandro\developer\prueba-nodejs\src\core\errors\custom.error.ts

/**
 * Base class for known operational errors within the application.
 */
export abstract class CustomeError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errorCode: string;

    constructor(message: string) {
        super(message);
        // Restore prototype to maintain the inheritance chain in TS
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Exception for input validation errors or syntactically incorrect data (HTTP 400).
 */

export class BadRequestError extends CustomeError {
    readonly statusCode = 400;
    readonly errorCode = "BAD_REQUEST";

    constructor(message: string = "incorrect request") {
        super(message);
    }
}

/**
 * Exception for resources not found in the database (HTTP 404).
 */

export class NotFoundError extends CustomeError {
    readonly statusCode = 404;
    readonly errorCode = "NOT_FOUND";

    constructor(message: string = "resource not found") {
        super(message);
    }
}

/**
 * Exception for authentication errors (HTTP 401).
 */
export class UnauthorizedError extends CustomeError {
    readonly statusCode = 401;
    readonly errorCode = "UNAUTHORIZED";

    constructor(message: string = "unauthorized") {
        super(message);
    }
}

/**
 * Exception for unauthorized access to resources/paths due to lack of permissions (HTTP 403).
 */
export class ForbiddenError extends CustomeError {
    readonly statusCode = 403;
    readonly errorCode = "FORBIDDEN";

    constructor(message: string = "Access denied: You do not have the necessary permissions") {
        super(message);
    }
}
