"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./core/config/env.config");
const database_1 = require("./core/database/database");
const setup_models_1 = require("./core/database/setup.models");
let server;
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        await (0, setup_models_1.setupDatabase)();
        const port = Number(env_config_1.ENV.PORT) || 3000;
        server = app_1.default.listen(port, "0.0.0.0", () => {
            console.log(`[Server]: API running on http://localhost:${port}`);
            console.log(`[Server]: Current Environment -> ${env_config_1.ENV.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error("[Server Error]: Failed to start application:", error);
        process.exit(1);
    }
};
const handleShutdown = async () => {
    console.log("\n[Server]: Cerrando conexiones para reiniciar...");
    try {
        await database_1.sequelize.close();
        console.log("[Database]: Conexión cerrada.");
    }
    catch (err) {
        console.error("[Database]: Error al cerrar la conexión", err);
    }
    if (server) {
        server.close(() => {
            console.log("[Server]: Puerto liberado.");
            process.exit(0);
        });
        setTimeout(() => {
            console.warn("[Server]: Forzando cierre...");
            process.exit(1);
        }, 2000);
    }
    else {
        process.exit(0);
    }
};
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
process.on("SIGUSR2", handleShutdown);
startServer();
