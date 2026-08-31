import { NextFunction, Request, Response } from "express";
import { requestService } from "./request.service";

export class RequestController {
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(201).json({ success: true, data: await requestService.create(req.body) });
        } catch (error) {
            next(error);
        }
    }

    public async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await requestService.findAll() });
        } catch (error) {
            next(error);
        }
    }

    public async findActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await requestService.findAll(true) });
        } catch (error) {
            next(error);
        }
    }

    public async findByClinic(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await requestService.findByClinic(req.params.clinicId) });
        } catch (error) {
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await requestService.findById(req.params.id) });
        } catch (error) {
            next(error);
        }
    }

    public async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await requestService.updateStatus(req.params.id, req.body) });
        } catch (error) {
            next(error);
        }
    }

    public async assign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ success: true, data: await requestService.assign(req.params.id, req.body) });
        } catch (error) {
            next(error);
        }
    }

    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await requestService.remove(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const requestController = new RequestController();
