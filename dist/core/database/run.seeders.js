"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
// Import Models
const clinic_model_1 = __importDefault(require("../../modules/clinic/clinic.model"));
const medication_model_1 = __importDefault(require("../../modules/medication/medication.model"));
const role_model_1 = __importDefault(require("../../modules/role/role.model"));
const warehouse_model_1 = __importDefault(require("../../modules/warehouse/warehouse.model"));
/**
 * Generic function to read a JSON file and insert it into the corresponding model.
 */
const seedTable = async (Model, fileName, tableName) => {
    try {
        const filePath = path_1.default.resolve(process.cwd(), "seeders", "data", fileName);
        if (!fs_1.default.existsSync(filePath)) {
            console.warn(`[Seeder]: Files ${fileName} Not found. Skipping...`);
            return;
        }
        const fileContent = fs_1.default.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        await Model.bulkCreate(data, { ignoreDuplicates: true });
        console.log(`[Seeder]: -> ${data.length} records inserted into ${tableName}.`);
    }
    catch (error) {
        console.error(`[Seeder]: Error inserting into ${tableName}:`, error);
    }
};
/**
 * Main Seeder orchestrator.
 * The order is important (e.g., Roles before Users).
 */
const runAllSeeders = async () => {
    console.log("[Seeder]: Starting the data entry process...\n");
    await (0, database_1.connectDB)();
    await seedTable(role_model_1.default, "roles.json", "Roles");
    await seedTable(clinic_model_1.default, "clinics.json", "Clinics");
    await seedTable(warehouse_model_1.default, "warehouses.json", "Warehouses");
    await seedTable(medication_model_1.default, "medications.json", "Medications");
    console.log("\n[Seeder]: Process successfully completed.");
    await database_1.sequelize.close();
    process.exit(0);
};
runAllSeeders();
