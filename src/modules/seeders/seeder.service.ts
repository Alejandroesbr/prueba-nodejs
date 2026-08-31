import { Transaction } from "sequelize";
import { sequelize } from "../../core/database/database";
import { BadRequestError, NotFoundError } from "../../core/errors/custom.error";
import { hashPassword } from "../../core/utils/hash.util";
import Clinic from "../clinic/clinic.model";
import Inventory from "../inventory/inventory.model";
import Medication from "../medication/medication.model";
import Role from "../role/role.model";
import User from "../user/user.model";
import Warehouse from "../warehouse/warehouse.model";

type JsonRecord = Record<string, unknown>;
type SeederFile = Pick<Express.Multer.File, "originalname" | "buffer">;

interface SeedSummary {
    files: string[];
    records: Record<string, number>;
}

export class SeederService {
    public async load(files: SeederFile[]): Promise<SeedSummary> {
        if (files.length === 0) throw new BadRequestError("At least one JSON file is required");

        const fileMap = new Map<string, JsonRecord[]>();
        for (const file of files) {
            const fileName = file.originalname.toLowerCase();
            if (fileMap.has(fileName)) throw new BadRequestError(`Duplicated seeder file: ${file.originalname}`);
            fileMap.set(fileName, this.parseArray(file));
        }

        return sequelize.transaction(async (transaction: Transaction) => {
            const records: Record<string, number> = {};
            records.roles = await this.seedRoles(fileMap.get("roles.json"), transaction);
            records.users = await this.seedUsers(fileMap.get("users.json"), transaction);
            records.clinics = await this.seedClinics(fileMap.get("clinics.json"), transaction);
            records.warehouses = await this.seedWarehouses(fileMap.get("warehouses.json"), transaction);
            records.medications = await this.seedMedications(fileMap.get("medications.json"), transaction);
            records.inventory = await this.seedInventory(fileMap.get("inventory.json"), transaction);
            return { files: files.map(file => file.originalname), records };
        });
    }

    private parseArray(file: SeederFile): JsonRecord[] {
        let parsed: unknown;
        try {
            parsed = JSON.parse(file.buffer.toString("utf-8"));
        } catch {
            throw new BadRequestError(`Invalid JSON in ${file.originalname}`);
        }
        if (
            !Array.isArray(parsed) ||
            parsed.some(item => typeof item !== "object" || item === null || Array.isArray(item))
        ) {
            throw new BadRequestError(`${file.originalname} must contain an array of JSON objects`);
        }
        return parsed as JsonRecord[];
    }

    private async seedRoles(rows: JsonRecord[] | undefined, transaction: Transaction): Promise<number> {
        if (!rows) return 0;
        for (const row of rows) {
            const name = this.requiredString(row, "name");
            const description = this.optionalString(row, "description");
            const [role] = await Role.findOrCreate({ where: { name }, defaults: { name, description }, transaction });
            if (role.description !== description) await role.update({ description }, { transaction });
        }
        return rows.length;
    }

    private async seedUsers(rows: JsonRecord[] | undefined, transaction: Transaction): Promise<number> {
        if (!rows) return 0;
        for (const row of rows) {
            const email = this.requiredString(row, "email").toLowerCase();
            const roleName = this.requiredString(row, "roleName");
            if (roleName !== "ADMIN" && roleName !== "REQUEST_MANAGER") {
                throw new BadRequestError(`Invalid role ${roleName} for ${email}`);
            }
            const role = await Role.findOne({ where: { name: roleName }, transaction });
            if (!role) throw new NotFoundError(`Role ${roleName} not found for ${email}`);
            const password = this.optionalString(row, "password");
            if (password && (password.length < 8 || !/[0-9]/.test(password))) {
                throw new BadRequestError(`Password for ${email} must contain at least 8 characters and one number`);
            }
            const user = await User.findOne({ where: { email }, transaction });
            if (user) {
                const update: { roleId: string; passwordHash?: string } = { roleId: role.id };
                if (password) update.passwordHash = await hashPassword(password);
                await user.update(update, { transaction });
            } else {
                if (!password) throw new BadRequestError(`Password is required for ${email}`);
                await User.create(
                    { email, passwordHash: await hashPassword(password), roleId: role.id },
                    { transaction },
                );
            }
        }
        return rows.length;
    }

    private async seedClinics(rows: JsonRecord[] | undefined, transaction: Transaction): Promise<number> {
        if (!rows) return 0;
        for (const row of rows) {
            const data = {
                name: this.requiredString(row, "name"),
                nit: this.requiredString(row, "nit"),
                managerName: this.requiredString(row, "managerName"),
                managerPhone: this.requiredString(row, "managerPhone"),
            };
            const clinic = await Clinic.findOne({ where: { nit: data.nit }, transaction });
            if (clinic) await clinic.update({ ...data, status: "ACTIVE" }, { transaction });
            else await Clinic.create(data, { transaction });
        }
        return rows.length;
    }

    private async seedWarehouses(rows: JsonRecord[] | undefined, transaction: Transaction): Promise<number> {
        if (!rows) return 0;
        for (const row of rows) {
            const data = {
                id: this.optionalUuid(row, "id"),
                name: this.requiredString(row, "name"),
                location: this.requiredString(row, "location"),
            };
            const warehouse = await Warehouse.findOne({ where: { name: data.name }, transaction });
            if (warehouse)
                await warehouse.update({ name: data.name, location: data.location, status: "ACTIVE" }, { transaction });
            else await Warehouse.create(data, { transaction });
        }
        return rows.length;
    }

    private async seedMedications(rows: JsonRecord[] | undefined, transaction: Transaction): Promise<number> {
        if (!rows) return 0;
        for (const row of rows) {
            const data = {
                id: this.optionalUuid(row, "id"),
                name: this.requiredString(row, "name"),
                description: this.optionalString(row, "description"),
            };
            const medication = await Medication.findOne({ where: { name: data.name }, transaction });
            if (medication)
                await medication.update(
                    { name: data.name, description: data.description, status: "ACTIVE" },
                    { transaction },
                );
            else await Medication.create(data, { transaction });
        }
        return rows.length;
    }

    private async seedInventory(rows: JsonRecord[] | undefined, transaction: Transaction): Promise<number> {
        if (!rows) return 0;
        for (const row of rows) {
            const warehouse = await this.findWarehouse(row, transaction);
            const medication = await this.findMedication(row, transaction);
            const quantity = this.requiredNumber(row, "quantity", 0);
            const inventory = await Inventory.findOne({
                where: { warehouseId: warehouse.id, medicationId: medication.id },
                transaction,
            });
            if (inventory) await inventory.update({ quantity, status: "ACTIVE" }, { transaction });
            else
                await Inventory.create(
                    { warehouseId: warehouse.id, medicationId: medication.id, quantity },
                    { transaction },
                );
        }
        return rows.length;
    }

    private async findWarehouse(row: JsonRecord, transaction: Transaction): Promise<Warehouse> {
        const id = this.optionalString(row, "warehouseId");
        const name = this.optionalString(row, "warehouseName");
        const warehouse = await Warehouse.findOne({ where: id ? { id } : { name: name ?? "" }, transaction });
        if (!warehouse) throw new NotFoundError("Warehouse reference not found in inventory");
        return warehouse;
    }

    private async findMedication(row: JsonRecord, transaction: Transaction): Promise<Medication> {
        const id = this.optionalString(row, "medicationId");
        const name = this.optionalString(row, "medicationName");
        const medication = await Medication.findOne({ where: id ? { id } : { name: name ?? "" }, transaction });
        if (!medication) throw new NotFoundError("Medication reference not found in inventory");
        return medication;
    }

    private requiredString(row: JsonRecord, field: string): string {
        const value = row[field];
        if (typeof value !== "string" || value.trim() === "") throw new BadRequestError(`${field} is required`);
        return value.trim();
    }

    private optionalString(row: JsonRecord, field: string): string | null {
        const value = row[field];
        if (value === undefined || value === null || value === "") return null;
        if (typeof value !== "string") throw new BadRequestError(`${field} must be a string`);
        return value.trim();
    }

    private requiredNumber(row: JsonRecord, field: string, minimum: number): number {
        const value = row[field];
        if (typeof value !== "number" || !Number.isInteger(value) || value < minimum) {
            throw new BadRequestError(`${field} must be an integer greater than or equal to ${minimum}`);
        }
        return value;
    }

    private optionalUuid(row: JsonRecord, field: string): string | undefined {
        const value = row[field];
        if (value === undefined || value === null || value === "") return undefined;
        if (
            typeof value !== "string" ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
        ) {
            throw new BadRequestError(`${field} must be a valid UUID`);
        }
        return value;
    }
}

export const seederService = new SeederService();
