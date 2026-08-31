import { BadRequestError, NotFoundError } from "../../core/errors/custom.error";
import Medication from "../medication/medication.model";
import Warehouse from "../warehouse/warehouse.model";
import Inventory from "./inventory.model";
import { CreateInventoryInput, UpdateInventoryInput } from "./inventory.dto";

export class InventoryService {
    public async create(data: CreateInventoryInput): Promise<Inventory> {
        await this.ensureRelations(data.warehouseId, data.medicationId);
        const existing = await Inventory.findOne({
            where: { warehouseId: data.warehouseId, medicationId: data.medicationId },
        });
        if (existing) {
            if (existing.status === "DELETED") {
                await existing.update({ quantity: data.quantity, status: "ACTIVE" });
                return existing;
            }
            throw new BadRequestError("Inventory already exists for this warehouse and medication");
        }
        return Inventory.create(data);
    }

    public async findAll(): Promise<Inventory[]> {
        return Inventory.findAll({
            where: { status: "ACTIVE" },
            include: [
                { model: Warehouse, as: "warehouse" },
                { model: Medication, as: "medication" },
            ],
        });
    }

    public async findById(id: string): Promise<Inventory> {
        const inventory = await Inventory.findOne({
            where: { id, status: "ACTIVE" },
            include: [
                { model: Warehouse, as: "warehouse" },
                { model: Medication, as: "medication" },
            ],
        });
        if (!inventory) throw new NotFoundError("Inventory not found");
        return inventory;
    }

    public async update(id: string, data: UpdateInventoryInput): Promise<Inventory> {
        const inventory = await this.findById(id);
        await inventory.update(data);
        return inventory;
    }

    public async remove(id: string): Promise<void> {
        const inventory = await this.findById(id);
        await inventory.update({ status: "DELETED" });
    }

    private async ensureRelations(warehouseId: string, medicationId: string): Promise<void> {
        const [warehouse, medication] = await Promise.all([
            Warehouse.findOne({ where: { id: warehouseId, status: "ACTIVE" } }),
            Medication.findOne({ where: { id: medicationId, status: "ACTIVE" } }),
        ]);
        if (!warehouse) throw new NotFoundError("Warehouse not found");
        if (!medication) throw new NotFoundError("Medication not found");
    }
}

export const inventoryService = new InventoryService();
