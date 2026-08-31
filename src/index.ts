import { Server } from "http";
import app from "./app";
import { ENV } from "./core/config/env.config";
import { connectDB, sequelize } from "./core/database/database";
import { setupDatabase } from "./core/database/setup.models";

let server: Server;

const startServer = async () => {
    try {
        await connectDB();
        await setupDatabase();

        const port = Number(ENV.PORT) || 3000;

        server = app.listen(port, "0.0.0.0", () => {
            console.log(`[Server]: API running on http://localhost:${port}`);
            console.log(`[Server]: Current Environment -> ${ENV.NODE_ENV}`);
        });
    } catch (error) {
        console.error("[Server Error]: Failed to start application:", error);
        process.exit(1);
    }
};

const handleShutdown = async () => {
    console.log("\n[Server]: Cerrando conexiones para reiniciar...");

    try {
        await sequelize.close();
        console.log("[Database]: Conexión cerrada.");
    } catch (err) {
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
    } else {
        process.exit(0);
    }
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
process.on("SIGUSR2", handleShutdown);

startServer();
