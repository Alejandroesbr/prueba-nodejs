"use strict";
//  /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
// We'll import the authService in the next step
const auth_service_1 = require("./auth.service");
class AuthController {
    /**
     * Handles the registration of a new user.
     * Delegates the creation to the service and returns a 201 (Created) status code.
     */
    async register(req, res, next) {
        try {
            // The JSON is already sanitized by the Joi middleware
            const newUser = await auth_service_1.authService.register(req.body);
            res.status(201).json({
                message: "User successfully registered",
                data: newUser, // The hash is automatically omitted thanks to the model's toJSON() method
            });
        }
        catch (error) {
            // Redirects semantic exceptions (e.g., duplicate email) to the central handler
            next(error);
        }
    }
    /**
     * Handles the login process.
     * Delegates credential validation to the service and establishes a secure session.
     */
    async login(req, res, next) {
        try {
            // The service returns the user's cleaned data and the signed JWT
            const { user, token } = await auth_service_1.authService.login(req.body);
            res.status(200).json({
                message: "Login successful",
                data: {
                    user,
                    token, // for postman
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
// We export a single instance (Singleton) of the controller
exports.authController = new AuthController();
