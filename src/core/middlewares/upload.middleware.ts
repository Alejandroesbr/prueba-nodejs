import multer, { FileFilterCallback } from "multer";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/custom.error";

const allowedSeederFiles = new Set([
    "roles.json",
    "users.json",
    "clinics.json",
    "warehouses.json",
    "medications.json",
    "inventory.json",
]);

const fileFilter = (_request: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    const isJson = file.mimetype === "application/json" || file.originalname.toLowerCase().endsWith(".json");
    if (!isJson || !allowedSeederFiles.has(file.originalname.toLowerCase())) {
        callback(new Error("Only the allowed JSON seeder files can be uploaded"));
        return;
    }
    callback(null, true);
};

const multerSeederUpload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 6, fileSize: 1024 * 1024 },
    fileFilter,
}).array("files", 6);

export const uploadSeederFiles = (request: Request, response: Response, next: NextFunction): void => {
    multerSeederUpload(request, response, error => {
        if (error) {
            next(new BadRequestError(error.message));
            return;
        }
        next();
    });
};
