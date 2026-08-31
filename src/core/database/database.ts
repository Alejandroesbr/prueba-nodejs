// /home/Coder / prueba - nodejs / api - riwimedicare / src / core / database / database.ts;

// Connect PostgreSQL

import { Sequelize } from "sequelize";
import { ENV } from "../config/env.config";

// Instance from Sequelize, btw use Singleton pattern

export const sequelize = new Sequelize(
    // Define the env for Sequelize
    ENV.DB_NAME,
    ENV.DB_USER,
    ENV.DB_PASSWORD,
    {
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        dialect: ENV.DB_DIALECT,

        // Manage the pool connection TCP
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },

        // Register new SQL queries in the terminal
        logging: ENV.NODE_ENV === "development" ? console.log : false,
    },
);

// test to auth the db, if fails we use the Fail-Fast method

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log(
            `[Database]: Successful connection to PostgreSQL at ${ENV.DB_HOST}:${ENV.DB_PORT} (BD: ${ENV.DB_NAME})`,
        );
    } catch (error) {
        console.error("[Database]: Critical error connecting to the database:", error);
        throw error;
    }
};
