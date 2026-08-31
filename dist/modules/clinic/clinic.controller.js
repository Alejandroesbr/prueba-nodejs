"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicController = exports.ClinicController = void 0;
const clinic_service_1 = require("./clinic.service");
class ClinicController {
    async create(req, res, next) {
        try {
            const clinic = await clinic_service_1.clinicService.create(req.body);
            res.status(201).json({ success: true, data: clinic });
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(_req, res, next) {
        try {
            const clinics = await clinic_service_1.clinicService.findAll();
            res.status(200).json({ success: true, data: clinics });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const clinic = await clinic_service_1.clinicService.findById(req.params.id);
            res.status(200).json({ success: true, data: clinic });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const clinic = await clinic_service_1.clinicService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: clinic });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            await clinic_service_1.clinicService.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClinicController = ClinicController;
exports.clinicController = new ClinicController();
