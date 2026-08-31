import { NextFunction, Request, Response } from "express";
import { inventoryService } from "./inventory.service";

export class InventoryController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(201).json({ success: true, data: await inventoryService.create(req.body) });
        } catch (error) {
            next(error);
        }
    }

    public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await inventoryService.findAll() });
        } catch (error) {
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await inventoryService.findById(req.params.id) });
        } catch (error) {
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await inventoryService.update(req.params.id, req.body) });
        } catch (error) {
            next(error);
        }
    }

    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await inventoryService.remove(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const inventoryController = new InventoryController();
