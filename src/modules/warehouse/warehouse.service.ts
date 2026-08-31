import { NotFoundError } from "../../core/errors/custom.error";
import { CreateWarehouseInput, UpdateWarehouseInput } from "./warehouse.dto";
import Warehouse from "./warehouse.model";

export class WarehouseService {
    public async create(data: CreateWarehouseInput): Promise<Warehouse> {
        return Warehouse.create(data);
    }

    public async findAll(): Promise<Warehouse[]> {
        return Warehouse.findAll({ where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]] });
    }

    public async findById(id: string): Promise<Warehouse> {
        const warehouse = await Warehouse.findOne({ where: { id, status: "ACTIVE" } });
        if (!warehouse) {
            throw new NotFoundError("Warehouse not found");
        }
        return warehouse;
    }

    public async update(id: string, data: UpdateWarehouseInput): Promise<Warehouse> {
        const warehouse = await this.findById(id);
        await warehouse.update(data);
        return warehouse;
    }

    public async remove(id: string): Promise<void> {
        const warehouse = await this.findById(id);
        await warehouse.update({ status: "DELETED" });
    }
}

export const warehouseService = new WarehouseService();
