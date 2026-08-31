// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/database/setup.models.ts

import { ENV } from "../config/env.config";
import { sequelize } from "./database";

// Import models from role and user
import Clinic from "../../modules/clinic/clinic.model";
import Inventory from "../../modules/inventory/inventory.model";
import Medication from "../../modules/medication/medication.model";
import SupplyRequest from "../../modules/request/request.model";
import Role from "../../modules/role/role.model";
import User from "../../modules/user/user.model";
import Warehouse from "../../modules/warehouse/warehouse.model";

// Import Seeders from role
import { seedRoles } from "../../modules/role/role.seeder";

/**
 * Centralized function to initialize associations and synchronize the schema.
 * Avoids circular dependencies by loading all classes first and then linking them.
 */
export const setupDatabase = async (): Promise<void> => {
    try {
        // One-to-Many (1:N) Association
        Role.hasMany(User, {
            foreignKey: "roleId",
            as: "users",
        });

        // Membership Association (Inverse)
        User.belongsTo(Role, {
            foreignKey: "roleId",
            as: "role",
        });

        Warehouse.hasMany(Inventory, { foreignKey: "warehouseId", as: "inventory" });
        Inventory.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });
        Medication.hasMany(Inventory, { foreignKey: "medicationId", as: "inventory" });
        Inventory.belongsTo(Medication, { foreignKey: "medicationId", as: "medication" });
        Clinic.hasMany(SupplyRequest, { foreignKey: "clinicId", as: "requests" });
        SupplyRequest.belongsTo(Clinic, { foreignKey: "clinicId", as: "clinic" });
        Medication.hasMany(SupplyRequest, { foreignKey: "medicationId", as: "requests" });
        SupplyRequest.belongsTo(Medication, { foreignKey: "medicationId", as: "medication" });
        Warehouse.hasMany(SupplyRequest, { foreignKey: "warehouseId", as: "requests" });
        SupplyRequest.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "warehouse" });

        // SYNCHRONIZATION WITH POSTGRESQL (CREATE TABLE IF NOT EXISTS)

        const isDevelopment = ENV.NODE_ENV === "development";

        await sequelize.sync({ alter: isDevelopment });

        console.log(`[Database]: Models and associations are correctly synchronized (alter: ${isDevelopment})`);

        // Ensure that the physical tables exist before inserting the master records.
        await seedRoles();
    } catch (error) {
        console.error("[Database]: Critical error while synchronizing models:", error);
        // We use Fail-Fast, if the tables cannot be created, the API must not start.
        process.exit(1);
    }
};
