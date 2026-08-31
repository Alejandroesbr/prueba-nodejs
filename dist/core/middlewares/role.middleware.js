"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/middlewares/role.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const custom_error_1 = require("../errors/custom.error");
/**
 * Factory Middleware for Role-Based Access Control (RBAC).
 *
 * @param allowedRoles - An array of strings containing the names of the authorized roles.
 * @returns An Express middleware function.
 */
const authorizeRoles = (allowedRoles) => {
    // Returns the standard Express signature (req, res, next)
    return (req, _res, next) => {
        try {
            // Step 3: Session Check (Ensures that the JWT middleware ran earlier)
            if (!req.user || !req.user.roleName) {
                throw new custom_error_1.UnauthorizedError("No valid session has been detected for authorization.");
            }
            // Step 4: Privilege Validation
            const userRole = req.user.roleName;
            // We check whether the token's role is in the list of allowed roles
            if (!allowedRoles.includes(userRole)) {
                // Step 6: Access Denied (HTTP 403)
                throw new custom_error_1.ForbiddenError(`Access denied. The ‘${userRole}’ role does not have permission for this action.`);
            }
            // Step 5: Relinquish Control (Access Granted)
            next();
        }
        catch (error) {
            // We pass the error to the central Express handler
            next(error);
        }
    };
};
exports.authorizeRoles = authorizeRoles;
