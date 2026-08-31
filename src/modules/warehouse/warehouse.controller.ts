import { NextFunction, Request, Response } from "express";
import { warehouseService } from "./warehouse.service";

export class WarehouseController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const warehouse = await warehouseService.create(req.body);
            res.status(201).json({ success: true, data: warehouse });
        } catch (error) {
            next(error);
        }
    }

    public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const warehouses = await warehouseService.findAll();
            res.status(200).json({ success: true, data: warehouses });
        } catch (error) {
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const warehouse = await warehouseService.findById(req.params.id);
            res.status(200).json({ success: true, data: warehouse });
        } catch (error) {
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const warehouse = await warehouseService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: warehouse });
        } catch (error) {
            next(error);
        }
    }

    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await warehouseService.remove(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const warehouseController = new WarehouseController();
