"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicationController = exports.MedicationController = void 0;
const medication_service_1 = require("./medication.service");
class MedicationController {
    async create(req, res, next) {
        try {
            const medication = await medication_service_1.medicationService.create(req.body);
            res.status(201).json({ success: true, data: medication });
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(_req, res, next) {
        try {
            const medications = await medication_service_1.medicationService.findAll();
            res.status(200).json({ success: true, data: medications });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const medication = await medication_service_1.medicationService.findById(req.params.id);
            res.status(200).json({ success: true, data: medication });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const medication = await medication_service_1.medicationService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: medication });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            await medication_service_1.medicationService.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MedicationController = MedicationController;
exports.medicationController = new MedicationController();
