"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seederService = exports.SeederService = void 0;
const database_1 = require("../../core/database/database");
const custom_error_1 = require("../../core/errors/custom.error");
const hash_util_1 = require("../../core/utils/hash.util");
const clinic_model_1 = __importDefault(require("../clinic/clinic.model"));
const inventory_model_1 = __importDefault(require("../inventory/inventory.model"));
const medication_model_1 = __importDefault(require("../medication/medication.model"));
const role_model_1 = __importDefault(require("../role/role.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const warehouse_model_1 = __importDefault(require("../warehouse/warehouse.model"));
class SeederService {
    async load(files) {
        if (files.length === 0)
            throw new custom_error_1.BadRequestError("At least one JSON file is required");
        const fileMap = new Map();
        for (const file of files) {
            const fileName = file.originalname.toLowerCase();
            if (fileMap.has(fileName))
                throw new custom_error_1.BadRequestError(`Duplicated seeder file: ${file.originalname}`);
            fileMap.set(fileName, this.parseArray(file));
        }
        return database_1.sequelize.transaction(async (transaction) => {
            const records = {};
            records.roles = await this.seedRoles(fileMap.get("roles.json"), transaction);
            records.users = await this.seedUsers(fileMap.get("users.json"), transaction);
            records.clinics = await this.seedClinics(fileMap.get("clinics.json"), transaction);
            records.warehouses = await this.seedWarehouses(fileMap.get("warehouses.json"), transaction);
            records.medications = await this.seedMedications(fileMap.get("medications.json"), transaction);
            records.inventory = await this.seedInventory(fileMap.get("inventory.json"), transaction);
            return { files: files.map(file => file.originalname), records };
        });
    }
    parseArray(file) {
        let parsed;
        try {
            parsed = JSON.parse(file.buffer.toString("utf-8"));
        }
        catch {
            throw new custom_error_1.BadRequestError(`Invalid JSON in ${file.originalname}`);
        }
        if (!Array.isArray(parsed) ||
            parsed.some(item => typeof item !== "object" || item === null || Array.isArray(item))) {
            throw new custom_error_1.BadRequestError(`${file.originalname} must contain an array of JSON objects`);
        }
        return parsed;
    }
    async seedRoles(rows, transaction) {
        if (!rows)
            return 0;
        for (const row of rows) {
            const name = this.requiredString(row, "name");
            const description = this.optionalString(row, "description");
            const [role] = await role_model_1.default.findOrCreate({ where: { name }, defaults: { name, description }, transaction });
            if (role.description !== description)
                await role.update({ description }, { transaction });
        }
        return rows.length;
    }
    async seedUsers(rows, transaction) {
        if (!rows)
            return 0;
        for (const row of rows) {
            const email = this.requiredString(row, "email").toLowerCase();
            const roleName = this.requiredString(row, "roleName");
            if (roleName !== "ADMIN" && roleName !== "REQUEST_MANAGER") {
                throw new custom_error_1.BadRequestError(`Invalid role ${roleName} for ${email}`);
            }
            const role = await role_model_1.default.findOne({ where: { name: roleName }, transaction });
            if (!role)
                throw new custom_error_1.NotFoundError(`Role ${roleName} not found for ${email}`);
            const password = this.optionalString(row, "password");
            if (password && (password.length < 8 || !/[0-9]/.test(password))) {
                throw new custom_error_1.BadRequestError(`Password for ${email} must contain at least 8 characters and one number`);
            }
            const user = await user_model_1.default.findOne({ where: { email }, transaction });
            if (user) {
                const update = { roleId: role.id };
                if (password)
                    update.passwordHash = await (0, hash_util_1.hashPassword)(password);
                await user.update(update, { transaction });
            }
            else {
                if (!password)
                    throw new custom_error_1.BadRequestError(`Password is required for ${email}`);
                await user_model_1.default.create({ email, passwordHash: await (0, hash_util_1.hashPassword)(password), roleId: role.id }, { transaction });
            }
        }
        return rows.length;
    }
    async seedClinics(rows, transaction) {
        if (!rows)
            return 0;
        for (const row of rows) {
            const data = {
                name: this.requiredString(row, "name"),
                nit: this.requiredString(row, "nit"),
                managerName: this.requiredString(row, "managerName"),
                managerPhone: this.requiredString(row, "managerPhone"),
            };
            const clinic = await clinic_model_1.default.findOne({ where: { nit: data.nit }, transaction });
            if (clinic)
                await clinic.update({ ...data, status: "ACTIVE" }, { transaction });
            else
                await clinic_model_1.default.create(data, { transaction });
        }
        return rows.length;
    }
    async seedWarehouses(rows, transaction) {
        if (!rows)
            return 0;
        for (const row of rows) {
            const data = {
                id: this.optionalUuid(row, "id"),
                name: this.requiredString(row, "name"),
                location: this.requiredString(row, "location"),
            };
            const warehouse = await warehouse_model_1.default.findOne({ where: { name: data.name }, transaction });
            if (warehouse)
                await warehouse.update({ name: data.name, location: data.location, status: "ACTIVE" }, { transaction });
            else
                await warehouse_model_1.default.create(data, { transaction });
        }
        return rows.length;
    }
    async seedMedications(rows, transaction) {
        if (!rows)
            return 0;
        for (const row of rows) {
            const data = {
                id: this.optionalUuid(row, "id"),
                name: this.requiredString(row, "name"),
                description: this.optionalString(row, "description"),
            };
            const medication = await medication_model_1.default.findOne({ where: { name: data.name }, transaction });
            if (medication)
                await medication.update({ name: data.name, description: data.description, status: "ACTIVE" }, { transaction });
            else
                await medication_model_1.default.create(data, { transaction });
        }
        return rows.length;
    }
    async seedInventory(rows, transaction) {
        if (!rows)
            return 0;
        for (const row of rows) {
            const warehouse = await this.findWarehouse(row, transaction);
            const medication = await this.findMedication(row, transaction);
            const quantity = this.requiredNumber(row, "quantity", 0);
            const inventory = await inventory_model_1.default.findOne({
                where: { warehouseId: warehouse.id, medicationId: medication.id },
                transaction,
            });
            if (inventory)
                await inventory.update({ quantity, status: "ACTIVE" }, { transaction });
            else
                await inventory_model_1.default.create({ warehouseId: warehouse.id, medicationId: medication.id, quantity }, { transaction });
        }
        return rows.length;
    }
    async findWarehouse(row, transaction) {
        const id = this.optionalString(row, "warehouseId");
        const name = this.optionalString(row, "warehouseName");
        const warehouse = await warehouse_model_1.default.findOne({ where: id ? { id } : { name: name ?? "" }, transaction });
        if (!warehouse)
            throw new custom_error_1.NotFoundError("Warehouse reference not found in inventory");
        return warehouse;
    }
    async findMedication(row, transaction) {
        const id = this.optionalString(row, "medicationId");
        const name = this.optionalString(row, "medicationName");
        const medication = await medication_model_1.default.findOne({ where: id ? { id } : { name: name ?? "" }, transaction });
        if (!medication)
            throw new custom_error_1.NotFoundError("Medication reference not found in inventory");
        return medication;
    }
    requiredString(row, field) {
        const value = row[field];
        if (typeof value !== "string" || value.trim() === "")
            throw new custom_error_1.BadRequestError(`${field} is required`);
        return value.trim();
    }
    optionalString(row, field) {
        const value = row[field];
        if (value === undefined || value === null || value === "")
            return null;
        if (typeof value !== "string")
            throw new custom_error_1.BadRequestError(`${field} must be a string`);
        return value.trim();
    }
    requiredNumber(row, field, minimum) {
        const value = row[field];
        if (typeof value !== "number" || !Number.isInteger(value) || value < minimum) {
            throw new custom_error_1.BadRequestError(`${field} must be an integer greater than or equal to ${minimum}`);
        }
        return value;
    }
    optionalUuid(row, field) {
        const value = row[field];
        if (value === undefined || value === null || value === "")
            return undefined;
        if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
            throw new custom_error_1.BadRequestError(`${field} must be a valid UUID`);
        }
        return value;
    }
}
exports.SeederService = SeederService;
exports.seederService = new SeederService();
