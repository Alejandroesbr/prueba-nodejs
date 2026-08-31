"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseService = exports.WarehouseService = void 0;
const custom_error_1 = require("../../core/errors/custom.error");
const warehouse_model_1 = __importDefault(require("./warehouse.model"));
class WarehouseService {
    async create(data) {
        return warehouse_model_1.default.create(data);
    }
    async findAll() {
        return warehouse_model_1.default.findAll({ where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]] });
    }
    async findById(id) {
        const warehouse = await warehouse_model_1.default.findOne({ where: { id, status: "ACTIVE" } });
        if (!warehouse) {
            throw new custom_error_1.NotFoundError("Warehouse not found");
        }
        return warehouse;
    }
    async update(id, data) {
        const warehouse = await this.findById(id);
        await warehouse.update(data);
        return warehouse;
    }
    async remove(id) {
        const warehouse = await this.findById(id);
        await warehouse.update({ status: "DELETED" });
    }
}
exports.WarehouseService = WarehouseService;
exports.warehouseService = new WarehouseService();
