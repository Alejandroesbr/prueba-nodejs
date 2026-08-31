"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const seeder_service_1 = require("../../modules/seeders/seeder.service");
/**
 * Main Seeder orchestrator.
 * The order is important (e.g., Roles before Users).
 */
const runAllSeeders = async () => {
    console.log("[Seeder]: Starting the data entry process...\n");
    await (0, database_1.connectDB)();
    const dataDirectory = path_1.default.resolve(__dirname, "../../modules/seeders/data");
    const fileNames = ["roles.json", "users.json", "clinics.json", "warehouses.json", "medications.json", "inventory.json"];
    const files = fileNames.map(fileName => ({
        originalname: fileName,
        buffer: fs_1.default.readFileSync(path_1.default.join(dataDirectory, fileName)),
    }));
    const result = await new seeder_service_1.SeederService().load(files);
    console.log(`[Seeder]: Loaded ${Object.values(result.records).reduce((total, count) => total + count, 0)} records.`);
    console.log("\n[Seeder]: Process successfully completed.");
    await database_1.sequelize.close();
    process.exit(0);
};
runAllSeeders().catch(async (error) => {
    console.error("[Seeder]: Process failed", error);
    await database_1.sequelize.close();
    process.exitCode = 1;
});
