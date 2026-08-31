import fs from "fs";
import path from "path";
import { connectDB, sequelize } from "./database";

// Import Models
import Clinic from "../../modules/clinic/clinic.model";
import Medication from "../../modules/medication/medication.model";
import Role from "../../modules/role/role.model";
import Warehouse from "../../modules/warehouse/warehouse.model";

/**
 * Generic function to read a JSON file and insert it into the corresponding model.
 */
const seedTable = async (Model: any, fileName: string, tableName: string) => {
    try {
        const filePath = path.resolve(process.cwd(), "seeders", "data", fileName);

        if (!fs.existsSync(filePath)) {
            console.warn(`[Seeder]: Files ${fileName} Not found. Skipping...`);
            return;
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        await Model.bulkCreate(data, { ignoreDuplicates: true });
        console.log(`[Seeder]: -> ${data.length} records inserted into ${tableName}.`);
    } catch (error) {
        console.error(`[Seeder]: Error inserting into ${tableName}:`, error);
    }
};

/**
 * Main Seeder orchestrator.
 * The order is important (e.g., Roles before Users).
 */
const runAllSeeders = async () => {
    console.log("[Seeder]: Starting the data entry process...\n");

    await connectDB();

    await seedTable(Role, "roles.json", "Roles");
    await seedTable(Clinic, "clinics.json", "Clinics");
    await seedTable(Warehouse, "warehouses.json", "Warehouses");
    await seedTable(Medication, "medications.json", "Medications");

    console.log("\n[Seeder]: Process successfully completed.");

    await sequelize.close();
    process.exit(0);
};

runAllSeeders();
