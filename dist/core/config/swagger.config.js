"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/config/swagger.config.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_config_1 = require("./env.config");
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Modular Layered API - Performance Test",
            version: "1.0.0",
            description: "API documentation for the Technical Performance Exam.",
        },
        servers: [
            {
                url: `http://localhost:${env_config_1.ENV.PORT}`,
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
