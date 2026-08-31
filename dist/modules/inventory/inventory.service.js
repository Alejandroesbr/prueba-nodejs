"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = exports.InventoryService = void 0;
const custom_error_1 = require("../../core/errors/custom.error");
const medication_model_1 = __importDefault(require("../medication/medication.model"));
const warehouse_model_1 = __importDefault(require("../warehouse/warehouse.model"));
const inventory_model_1 = __importDefault(require("./inventory.model"));
class InventoryService {
    async create(data) {
        await this.ensureRelations(data.warehouseId, data.medicationId);
        const existing = await inventory_model_1.default.findOne({
            where: { warehouseId: data.warehouseId, medicationId: data.medicationId },
        });
        if (existing) {
            if (existing.status === "DELETED") {
                await existing.update({ quantity: data.quantity, status: "ACTIVE" });
                return existing;
            }
            throw new custom_error_1.BadRequestError("Inventory already exists for this warehouse and medication");
        }
        return inventory_model_1.default.create(data);
    }
    async findAll() {
        return inventory_model_1.default.findAll({
            where: { status: "ACTIVE" },
            include: [
                { model: warehouse_model_1.default, as: "warehouse" },
                { model: medication_model_1.default, as: "medication" },
            ],
        });
    }
    async findById(id) {
        const inventory = await inventory_model_1.default.findOne({
            where: { id, status: "ACTIVE" },
            include: [
                { model: warehouse_model_1.default, as: "warehouse" },
                { model: medication_model_1.default, as: "medication" },
            ],
        });
        if (!inventory)
            throw new custom_error_1.NotFoundError("Inventory not found");
        return inventory;
    }
    async update(id, data) {
        const inventory = await this.findById(id);
        await inventory.update(data);
        return inventory;
    }
    async remove(id) {
        const inventory = await this.findById(id);
        await inventory.update({ status: "DELETED" });
    }
    async ensureRelations(warehouseId, medicationId) {
        const [warehouse, medication] = await Promise.all([
            warehouse_model_1.default.findOne({ where: { id: warehouseId, status: "ACTIVE" } }),
            medication_model_1.default.findOne({ where: { id: medicationId, status: "ACTIVE" } }),
        ]);
        if (!warehouse)
            throw new custom_error_1.NotFoundError("Warehouse not found");
        if (!medication)
            throw new custom_error_1.NotFoundError("Medication not found");
    }
}
exports.InventoryService = InventoryService;
exports.inventoryService = new InventoryService();
