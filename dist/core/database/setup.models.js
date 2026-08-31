"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/database/setup.models.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDatabase = void 0;
const env_config_1 = require("../config/env.config");
const database_1 = require("./database");
// Import models from role and user
const role_model_1 = __importDefault(require("../../modules/role/role.model"));
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
const clinic_model_1 = __importDefault(require("../../modules/clinic/clinic.model"));
const inventory_model_1 = __importDefault(require("../../modules/inventory/inventory.model"));
const medication_model_1 = __importDefault(require("../../modules/medication/medication.model"));
const request_model_1 = __importDefault(require("../../modules/request/request.model"));
const warehouse_model_1 = __importDefault(require("../../modules/warehouse/warehouse.model"));
// Import Seeders from role
const role_seeder_1 = require("../../modules/role/role.seeder");
/**
 * Centralized function to initialize associations and synchronize the schema.
 * Avoids circular dependencies by loading all classes first and then linking them.
 */
const setupDatabase = async () => {
    try {
        // One-to-Many (1:N) Association
        role_model_1.default.hasMany(user_model_1.default, {
            foreignKey: "roleId",
            as: "users",
        });
        // Membership Association (Inverse)
        user_model_1.default.belongsTo(role_model_1.default, {
            foreignKey: "roleId",
            as: "role",
        });
        warehouse_model_1.default.hasMany(inventory_model_1.default, { foreignKey: "warehouseId", as: "inventory" });
        inventory_model_1.default.belongsTo(warehouse_model_1.default, { foreignKey: "warehouseId", as: "warehouse" });
        medication_model_1.default.hasMany(inventory_model_1.default, { foreignKey: "medicationId", as: "inventory" });
        inventory_model_1.default.belongsTo(medication_model_1.default, { foreignKey: "medicationId", as: "medication" });
        clinic_model_1.default.hasMany(request_model_1.default, { foreignKey: "clinicId", as: "requests" });
        request_model_1.default.belongsTo(clinic_model_1.default, { foreignKey: "clinicId", as: "clinic" });
        medication_model_1.default.hasMany(request_model_1.default, { foreignKey: "medicationId", as: "requests" });
        request_model_1.default.belongsTo(medication_model_1.default, { foreignKey: "medicationId", as: "medication" });
        warehouse_model_1.default.hasMany(request_model_1.default, { foreignKey: "warehouseId", as: "requests" });
        request_model_1.default.belongsTo(warehouse_model_1.default, { foreignKey: "warehouseId", as: "warehouse" });
        // SYNCHRONIZATION WITH POSTGRESQL (CREATE TABLE IF NOT EXISTS)
        const isDevelopment = env_config_1.ENV.NODE_ENV === "development";
        await database_1.sequelize.sync({ alter: isDevelopment });
        console.log(`[Database]: Models and associations are correctly synchronized (alter: ${isDevelopment})`);
        // Ensure that the physical tables exist before inserting the master records.
        await (0, role_seeder_1.seedRoles)();
    }
    catch (error) {
        console.error("[Database]: Critical error while synchronizing models:", error);
        // We use Fail-Fast, if the tables cannot be created, the API must not start.
        process.exit(1);
    }
};
exports.setupDatabase = setupDatabase;
