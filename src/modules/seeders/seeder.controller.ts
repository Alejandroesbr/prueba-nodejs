import { NextFunction, Request, Response } from "express";
import { seederService } from "./seeder.service";

export class SeederController {
    public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = (req.files as Express.Multer.File[] | undefined) ?? [];
            const result = await seederService.load(files);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const seederController = new SeederController();
