// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/config/swagger.config.ts

import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { ENV } from "./env.config";

const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Modular Layered API - Performance Test",
            version: "1.0.0",
            description: "API documentation for the Technical Performance Exam.",
        },
        servers: [
            {
                url: `http://localhost:${ENV.PORT}`,
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer <token>",
                },
            },
        },
        // Applies the security scheme globally to all endpoints (optional, can be done per endpoint)
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Pattern to find JSDoc comments across all your modular routes
    apis: ["./src/modules/**/*.routes.ts", "./dist/modules/**/*.routes.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
