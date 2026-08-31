import { Op, Transaction } from "sequelize";
import { sequelize } from "../../core/database/database";
import { BadRequestError, NotFoundError } from "../../core/errors/custom.error";
import Clinic from "../clinic/clinic.model";
import Medication from "../medication/medication.model";
import Warehouse from "../warehouse/warehouse.model";
import Inventory from "../inventory/inventory.model";
import SupplyRequest, { RequestStatus } from "./request.model";
import { AssignRequestInput, CreateRequestInput, UpdateRequestStatusInput } from "./request.dto";

const transitions: Record<RequestStatus, RequestStatus[]> = {
    PENDING: ["REJECTED", "CANCELLED"],
    ASSIGNED: ["APPROVED", "REJECTED", "CANCELLED"],
    APPROVED: ["IN_PROGRESS", "REJECTED", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    REJECTED: [],
    COMPLETED: [],
    CANCELLED: [],
    DELETED: [],
};

export class RequestService {
    public async create(data: CreateRequestInput): Promise<SupplyRequest> {
        return sequelize.transaction(async (transaction: Transaction) => {
            const [clinic, medication, warehouse] = await Promise.all([
                Clinic.findOne({ where: { id: data.clinicId, status: "ACTIVE" }, transaction }),
                Medication.findOne({ where: { id: data.medicationId, status: "ACTIVE" }, transaction }),
                Warehouse.findOne({ where: { id: data.warehouseId, status: "ACTIVE" }, transaction }),
            ]);
            if (!clinic) throw new NotFoundError("Clinic not found");
            if (!medication) throw new NotFoundError("Medication not found");
            if (!warehouse) throw new NotFoundError("Warehouse not found");

            const inventory = await Inventory.findOne({
                where: { warehouseId: data.warehouseId, medicationId: data.medicationId, status: "ACTIVE" },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!inventory) throw new BadRequestError("No active inventory exists for this warehouse and medication");
            if (inventory.quantity < data.quantity) throw new BadRequestError("Insufficient inventory");

            await inventory.decrement("quantity", { by: data.quantity, transaction });
            return SupplyRequest.create(data, { transaction });
        });
    }

    public async findAll(activeOnly = false): Promise<SupplyRequest[]> {
        return SupplyRequest.findAll({
            where: activeOnly
                ? { status: ["PENDING", "ASSIGNED", "APPROVED", "IN_PROGRESS"] }
                : { status: { [Op.ne]: "DELETED" } },
            include: [
                { model: Clinic, as: "clinic" },
                { model: Medication, as: "medication" },
                { model: Warehouse, as: "warehouse" },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    public async assign(id: string, data: AssignRequestInput): Promise<SupplyRequest> {
        return sequelize.transaction(async (transaction: Transaction) => {
            const request = await SupplyRequest.findOne({
                where: { id, status: { [Op.ne]: "DELETED" } },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request) throw new NotFoundError("Supply request not found");
            if (request.status === "ASSIGNED" && request.warehouseId === data.warehouseId) return request;
            if (request.status !== "PENDING") {
                throw new BadRequestError("Only PENDING requests can be assigned");
            }

            const warehouse = await Warehouse.findOne({
                where: { id: data.warehouseId, status: "ACTIVE" },
                transaction,
            });
            if (!warehouse) throw new NotFoundError("Warehouse not found");

            if (request.warehouseId === data.warehouseId) {
                await request.update({ status: "ASSIGNED" }, { transaction });
                return request;
            }

            const newInventory = await Inventory.findOne({
                where: { warehouseId: data.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!newInventory)
                throw new BadRequestError("No active inventory exists for the assigned warehouse and medication");
            if (newInventory.quantity < request.quantity)
                throw new BadRequestError("Insufficient inventory in the assigned warehouse");

            const oldInventory = await Inventory.findOne({
                where: { warehouseId: request.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!oldInventory) throw new BadRequestError("Cannot release the reservation from the current warehouse");

            await oldInventory.increment("quantity", { by: request.quantity, transaction });
            await newInventory.decrement("quantity", { by: request.quantity, transaction });
            await request.update({ warehouseId: data.warehouseId, status: "ASSIGNED" }, { transaction });
            return request;
        });
    }

    public async findByClinic(clinicId: string): Promise<SupplyRequest[]> {
        const clinic = await Clinic.findOne({ where: { id: clinicId, status: "ACTIVE" } });
        if (!clinic) throw new NotFoundError("Clinic not found");
        return SupplyRequest.findAll({
            where: { clinicId, status: { [Op.ne]: "DELETED" } },
            order: [["createdAt", "DESC"]],
        });
    }

    public async findById(id: string): Promise<SupplyRequest> {
        const request = await SupplyRequest.findOne({ where: { id, status: { [Op.ne]: "DELETED" } } });
        if (!request) throw new NotFoundError("Supply request not found");
        return request;
    }

    public async updateStatus(id: string, data: UpdateRequestStatusInput): Promise<SupplyRequest> {
        return sequelize.transaction(async (transaction: Transaction) => {
            const request = await SupplyRequest.findOne({
                where: { id, status: { [Op.ne]: "DELETED" } },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request) throw new NotFoundError("Supply request not found");
            if (!transitions[request.status].includes(data.status)) {
                throw new BadRequestError(`Invalid status transition from ${request.status} to ${data.status}`);
            }
            if (["REJECTED", "CANCELLED"].includes(data.status)) {
                const inventory = await Inventory.findOne({
                    where: { warehouseId: request.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });
                if (inventory) await inventory.increment("quantity", { by: request.quantity, transaction });
            }
            await request.update({ status: data.status }, { transaction });
            return request;
        });
    }

    public async remove(id: string): Promise<void> {
        await sequelize.transaction(async (transaction: Transaction) => {
            const request = await SupplyRequest.findOne({
                where: { id, status: { [Op.ne]: "DELETED" } },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request) throw new NotFoundError("Supply request not found");

            if (["PENDING", "ASSIGNED", "APPROVED", "IN_PROGRESS"].includes(request.status)) {
                const inventory = await Inventory.findOne({
                    where: { warehouseId: request.warehouseId, medicationId: request.medicationId, status: "ACTIVE" },
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });
                if (!inventory) throw new BadRequestError("Cannot restore inventory for this request");
                await inventory.increment("quantity", { by: request.quantity, transaction });
            }

            await request.update({ status: "DELETED" }, { transaction });
        });
    }
}

export const requestService = new RequestService();
