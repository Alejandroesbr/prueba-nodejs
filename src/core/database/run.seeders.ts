import fs from "fs";
import path from "path";
import { connectDB, sequelize } from "./database";
import { SeederService } from "../../modules/seeders/seeder.service";

/**
 * Main Seeder orchestrator.
 * The order is important (e.g., Roles before Users).
 */
const runAllSeeders = async () => {
    console.log("[Seeder]: Starting the data entry process...\n");

    await connectDB();

    const dataDirectory = path.resolve(__dirname, "../../modules/seeders/data");
    const fileNames = [
        "roles.json",
        "users.json",
        "clinics.json",
        "warehouses.json",
        "medications.json",
        "inventory.json",
    ];
    const files = fileNames.map(fileName => ({
        originalname: fileName,
        buffer: fs.readFileSync(path.join(dataDirectory, fileName)),
    }));
    const result = await new SeederService().load(files);
    console.log(
        `[Seeder]: Loaded ${Object.values(result.records).reduce((total, count) => total + count, 0)} records.`,
    );

    console.log("\n[Seeder]: Process successfully completed.");

    await sequelize.close();
    process.exit(0);
};

runAllSeeders().catch(async error => {
    console.error("[Seeder]: Process failed", error);
    await sequelize.close();
    process.exitCode = 1;
});
