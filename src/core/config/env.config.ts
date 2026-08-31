// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/config/env.config.ts

// Centralize process.env

import * as dotenv from "dotenv";
import * as path from "path";
import Joi = require("joi");

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
export const ENV = {
    NODE_ENV: envVars.NODE_ENV as string,
    PORT: envVars.PORT as number,

    DB_HOST: envVars.DB_HOST as string,
    DB_PORT: envVars.DB_PORT as number,
    DB_USER: envVars.DB_USER as string,
    DB_PASSWORD: envVars.DB_PASSWORD as string,
    DB_NAME: envVars.DB_NAME as string,
    DB_DIALECT: "postgres" as const,

    JWT_SECRET: envVars.JWT_SECRET as string,
    JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN as string,
} as const;
