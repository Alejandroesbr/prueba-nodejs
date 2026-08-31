"use strict";
// /home/Coder / prueba - nodejs / api - riwimedicare / src / core / database / database.ts;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
// Connect PostgreSQL
const sequelize_1 = require("sequelize");
const env_config_1 = require("../config/env.config");
// Instance from Sequelize, btw use Singleton pattern
exports.sequelize = new sequelize_1.Sequelize(
// Define the env for Sequelize
env_config_1.ENV.DB_NAME, env_config_1.ENV.DB_USER, env_config_1.ENV.DB_PASSWORD, {
    host: env_config_1.ENV.DB_HOST,
    port: env_config_1.ENV.DB_PORT,
    dialect: env_config_1.ENV.DB_DIALECT,
    // Manage the pool connection TCP
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // Register new SQL queries in the terminal
    logging: env_config_1.ENV.NODE_ENV === "development" ? console.log : false,
});
// test to auth the db, if fails we use the Fail-Fast method
const connectDB = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log(`[Database]: Successful connection to PostgreSQL at ${env_config_1.ENV.DB_HOST}:${env_config_1.ENV.DB_PORT} (BD: ${env_config_1.ENV.DB_NAME})`);
    }
    catch (error) {
        console.error("[Database]: Critical error connecting to the database:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
