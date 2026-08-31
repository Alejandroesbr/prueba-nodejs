import { NextFunction, Request, Response } from "express";
import { medicationService } from "./medication.service";

export class MedicationController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const medication = await medicationService.create(req.body);
            res.status(201).json({ success: true, data: medication });
        } catch (error) {
            next(error);
        }
    }

    public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const medications = await medicationService.findAll();
            res.status(200).json({ success: true, data: medications });
        } catch (error) {
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const medication = await medicationService.findById(req.params.id);
            res.status(200).json({ success: true, data: medication });
        } catch (error) {
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const medication = await medicationService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: medication });
        } catch (error) {
            next(error);
        }
    }

    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await medicationService.remove(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const medicationController = new MedicationController();
