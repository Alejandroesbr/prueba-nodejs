import { NextFunction, Request, Response } from "express";
import { clinicService } from "./clinic.service";

export class ClinicController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clinic = await clinicService.create(req.body);
            res.status(201).json({ success: true, data: clinic });
        } catch (error) {
            next(error);
        }
    }

    public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clinics = await clinicService.findAll();
            res.status(200).json({ success: true, data: clinics });
        } catch (error) {
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clinic = await clinicService.findById(req.params.id);
            res.status(200).json({ success: true, data: clinic });
        } catch (error) {
            next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clinic = await clinicService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: clinic });
        } catch (error) {
            next(error);
        }
    }

    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await clinicService.remove(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const clinicController = new ClinicController();
