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
            title: "Riwimedicare Supply API",
            version: "1.0.0",
            description: "REST API for managing clinics, warehouses, medications and supply requests.",
        },
        tags: [
            { name: "Authentication", description: "User registration and login operations" },
            { name: "Clinics", description: "Clinic and responsible-person management" },
            { name: "Warehouses", description: "Warehouse management" },
            { name: "Medications", description: "Medication catalogue management" },
            { name: "Inventory", description: "Medication stock per warehouse" },
            { name: "Requests", description: "Medication supply requests and status tracking" },
            { name: "Seeders", description: "Transactional bulk loading of base JSON data" },
        ],
        servers: [
            {
                url: `http://localhost:${env_config_1.ENV.PORT}`,
                description: "Local Development Server",
            },
        ],
        components: {
            schemas: {
                Clinic: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Central Clinic" },
                        nit: { type: "string", example: "900111222" },
                        managerName: { type: "string", example: "Dr. House" },
                        managerPhone: { type: "string", example: "555-1234" },
                        status: { type: "string", enum: ["ACTIVE", "DELETED"], example: "ACTIVE" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Warehouse: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "North warehouse" },
                        location: { type: "string", example: "Industrial warehouse 4" },
                        status: { type: "string", enum: ["ACTIVE", "DELETED"], example: "ACTIVE" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Medication: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Paracetamol 500mg" },
                        description: { type: "string", nullable: true, example: "Common pain reliever" },
                        status: { type: "string", enum: ["ACTIVE", "DELETED"], example: "ACTIVE" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Inventory: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        warehouseId: { type: "string", format: "uuid" },
                        medicationId: { type: "string", format: "uuid" },
                        quantity: { type: "integer", minimum: 0, example: 100 },
                        status: { type: "string", enum: ["ACTIVE", "DELETED"], example: "ACTIVE" },
                    },
                },
                SupplyRequest: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        clinicId: { type: "string", format: "uuid" },
                        medicationId: { type: "string", format: "uuid" },
                        warehouseId: { type: "string", format: "uuid" },
                        quantity: { type: "integer", minimum: 1, example: 10 },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "ASSIGNED",
                                "APPROVED",
                                "IN_PROGRESS",
                                "REJECTED",
                                "COMPLETED",
                                "CANCELLED",
                                "DELETED",
                            ],
                            example: "PENDING",
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string", format: "email", example: "admin@example.com" },
                        roleId: { type: "string", format: "uuid" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Resource not found" },
                        code: { type: "string", example: "NOT_FOUND" },
                    },
                },
            },
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
