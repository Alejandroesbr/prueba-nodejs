"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestService = exports.RequestService = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
const custom_error_1 = require("../../core/errors/custom.error");
const clinic_model_1 = __importDefault(require("../clinic/clinic.model"));
const medication_model_1 = __importDefault(require("../medication/medication.model"));
const warehouse_model_1 = __importDefault(require("../warehouse/warehouse.model"));
const inventory_model_1 = __importDefault(require("../inventory/inventory.model"));
const request_model_1 = __importDefault(require("./request.model"));
const transitions = {
    PENDING: ["REJECTED", "CANCELLED"],
    ASSIGNED: ["APPROVED", "REJECTED", "CANCELLED"],
    APPROVED: ["IN_PROGRESS", "REJECTED", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    REJECTED: [],
    COMPLETED: [],
    CANCELLED: [],
    DELETED: [],
};
class RequestService {
    async create(data) {
        return database_1.sequelize.transaction(async (transaction) => {
            const [clinic, medication, warehouse] = await Promise.all([
                clinic_model_1.default.findOne({ where: { id: data.clinicId, status: "ACTIVE" }, transaction }),
                medication_model_1.default.findOne({ where: { id: data.medicationId, status: "ACTIVE" }, transaction }),
                warehouse_model_1.default.findOne({ where: { id: data.warehouseId, status: "ACTIVE" }, transaction }),
            ]);
            if (!clinic)
                throw new custom_error_1.NotFoundError("Clinic not found");
            if (!medication)
                throw new custom_error_1.NotFoundError("Medication not found");
            if (!warehouse)
                throw new custom_error_1.NotFoundError("Warehouse not found");
            const inventory = await inventory_model_1.default.findOne({
                where: { warehouseId: data.warehouseId, medicationId: data.medicationId, status: "ACTIVE" },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!inventory)
                throw new custom_error_1.BadRequestError("No active inventory exists for this warehouse and medication");
            if (inventory.quantity < data.quantity)
                throw new custom_error_1.BadRequestError("Insufficient inventory");
            await inventory.decrement("quantity", { by: data.quantity, transaction });
            return request_model_1.default.create(data, { transaction });
        });
    }
    async findAll(activeOnly = false) {
        return request_model_1.default.findAll({
            where: activeOnly
                ? { status: ["PENDING", "ASSIGNED", "APPROVED", "IN_PROGRESS"] }
                : { status: { [sequelize_1.Op.ne]: "DELETED" } },
            include: [
                { model: clinic_model_1.default, as: "clinic" },
                { model: medication_model_1.default, as: "medication" },
                { model: warehouse_model_1.default, as: "warehouse" },
            ],
            order: [["createdAt", "DESC"]],
        });
    }
    async assign(id, data) {
        return database_1.sequelize.transaction(async (transaction) => {
            const request = await request_model_1.default.findOne({
                where: { id, status: { [sequelize_1.Op.ne]: "DELETED" } },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request)
                throw new custom_error_1.NotFoundError("Supply request not found");
            if (request.status === "ASSIGNED" && request.warehouseId === data.warehouseId)
                return request;
            if (request.status !== "PENDING") {
                throw new custom_error_1.BadRequestError("Only PENDING requests can be assigned");
            }
            const warehouse = await warehouse_model_1.default.findOne({
                where: { id: data.warehouseId, status: "ACTIVE" },
                transaction,
            });
            if (!warehouse)
                throw new custom_error_1.NotFoundError("Warehouse not found");
            if (request.warehouseId === data.warehouseId) {
                await request.update({ status: "ASSIGNED" }, { transaction });
                return request;
            }
            const newInventory = await inventory_model_1.default.findOne({
                where: { warehouseId: data.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!newInventory)
                throw new custom_error_1.BadRequestError("No active inventory exists for the assigned warehouse and medication");
            if (newInventory.quantity < request.quantity)
                throw new custom_error_1.BadRequestError("Insufficient inventory in the assigned warehouse");
            const oldInventory = await inventory_model_1.default.findOne({
                where: { warehouseId: request.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!oldInventory)
                throw new custom_error_1.BadRequestError("Cannot release the reservation from the current warehouse");
            await oldInventory.increment("quantity", { by: request.quantity, transaction });
            await newInventory.decrement("quantity", { by: request.quantity, transaction });
            await request.update({ warehouseId: data.warehouseId, status: "ASSIGNED" }, { transaction });
            return request;
        });
    }
    async findByClinic(clinicId) {
        const clinic = await clinic_model_1.default.findOne({ where: { id: clinicId, status: "ACTIVE" } });
        if (!clinic)
            throw new custom_error_1.NotFoundError("Clinic not found");
        return request_model_1.default.findAll({
            where: { clinicId, status: { [sequelize_1.Op.ne]: "DELETED" } },
            order: [["createdAt", "DESC"]],
        });
    }
    async findById(id) {
        const request = await request_model_1.default.findOne({ where: { id, status: { [sequelize_1.Op.ne]: "DELETED" } } });
        if (!request)
            throw new custom_error_1.NotFoundError("Supply request not found");
        return request;
    }
    async updateStatus(id, data) {
        return database_1.sequelize.transaction(async (transaction) => {
            const request = await request_model_1.default.findOne({
                where: { id, status: { [sequelize_1.Op.ne]: "DELETED" } },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request)
                throw new custom_error_1.NotFoundError("Supply request not found");
            if (!transitions[request.status].includes(data.status)) {
                throw new custom_error_1.BadRequestError(`Invalid status transition from ${request.status} to ${data.status}`);
            }
            if (["REJECTED", "CANCELLED"].includes(data.status)) {
                const inventory = await inventory_model_1.default.findOne({
                    where: { warehouseId: request.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });
                if (inventory)
                    await inventory.increment("quantity", { by: request.quantity, transaction });
            }
            await request.update({ status: data.status }, { transaction });
            return request;
        });
    }
    async remove(id) {
        await database_1.sequelize.transaction(async (transaction) => {
            const request = await request_model_1.default.findOne({
                where: { id, status: { [sequelize_1.Op.ne]: "DELETED" } },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request)
                throw new custom_error_1.NotFoundError("Supply request not found");
            if (["PENDING", "ASSIGNED", "APPROVED", "IN_PROGRESS"].includes(request.status)) {
                const inventory = await inventory_model_1.default.findOne({
                    where: { warehouseId: request.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });
                if (!inventory)
                    throw new custom_error_1.BadRequestError("Cannot restore inventory for this request");
                await inventory.increment("quantity", { by: request.quantity, transaction });
            }
            await request.update({ status: "DELETED" }, { transaction });
        });
    }
}
exports.RequestService = RequestService;
exports.requestService = new RequestService();
