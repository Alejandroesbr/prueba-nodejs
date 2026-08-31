"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/config/env.config.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
// Centralize process.env
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const Joi = require("joi");
// Run from the root directory using ‘tsx’; process.cwd() points to 'prueba-nodejs'
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// Define schema from Joi
const envVarSchema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default("1h"),
}).unknown();
const { value: envVars, error } = envVarSchema.validate(process.env);
if (error) {
    throw new Error(`Validation error in configurations (.env): ${error.message}`);
}
// Frozen, strongly typed global configuration object
exports.ENV = {
    NODE_ENV: envVars.NODE_ENV,
    PORT: envVars.PORT,
    DB_HOST: envVars.DB_HOST,
    DB_PORT: envVars.DB_PORT,
    DB_USER: envVars.DB_USER,
    DB_PASSWORD: envVars.DB_PASSWORD,
    DB_NAME: envVars.DB_NAME,
    DB_DIALECT: "postgres",
    JWT_SECRET: envVars.JWT_SECRET,
    JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
};
