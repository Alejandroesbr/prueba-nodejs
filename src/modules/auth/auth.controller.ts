//  /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.controller.ts

import { NextFunction, Request, Response } from "express";
// We'll import the authService in the next step

import { authService } from "./auth.service";

export class AuthController {
    /**
     * Handles the registration of a new user.
     * Delegates the creation to the service and returns a 201 (Created) status code.
     */
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // The JSON is already sanitized by the Joi middleware
            const newUser = await authService.register(req.body);

            res.status(201).json({
                message: "User successfully registered",
                data: newUser, // The hash is automatically omitted thanks to the model's toJSON() method
            });
        } catch (error) {
            // Redirects semantic exceptions (e.g., duplicate email) to the central handler
            next(error);
        }
    }

    /**
     * Handles the login process.
     * Delegates credential validation to the service and establishes a secure session.
     */
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // The service returns the user's cleaned data and the signed JWT
            const { user, token } = await authService.login(req.body);

            res.status(200).json({
                message: "Login successful",
                data: {
                    user,
                    token, // for postman
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
// We export a single instance (Singleton) of the controller

export const authController = new AuthController();
