"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestController = exports.RequestController = void 0;
const request_service_1 = require("./request.service");
class RequestController {
    async create(req, res, next) {
        try {
            res.status(201).json({ success: true, data: await request_service_1.requestService.create(req.body) });
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(_req, res, next) {
        try {
            res.status(200).json({ success: true, data: await request_service_1.requestService.findAll() });
        }
        catch (error) {
            next(error);
        }
    }
    async findActive(_req, res, next) {
        try {
            res.status(200).json({ success: true, data: await request_service_1.requestService.findAll(true) });
        }
        catch (error) {
            next(error);
        }
    }
    async findByClinic(req, res, next) {
        try {
            res.status(200).json({ success: true, data: await request_service_1.requestService.findByClinic(req.params.clinicId) });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            res.status(200).json({ success: true, data: await request_service_1.requestService.findById(req.params.id) });
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            res.status(200).json({ success: true, data: await request_service_1.requestService.updateStatus(req.params.id, req.body) });
        }
        catch (error) {
            next(error);
        }
    }
    async assign(req, res, next) {
        try {
            res.status(200).json({ success: true, data: await request_service_1.requestService.assign(req.params.id, req.body) });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            await request_service_1.requestService.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RequestController = RequestController;
exports.requestController = new RequestController();
