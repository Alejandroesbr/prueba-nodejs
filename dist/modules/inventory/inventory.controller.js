"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = exports.InventoryController = void 0;
const inventory_service_1 = require("./inventory.service");
class InventoryController {
    async create(req, res, next) {
        try {
            res.status(201).json({ success: true, data: await inventory_service_1.inventoryService.create(req.body) });
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(_req, res, next) {
        try {
            res.status(200).json({ success: true, data: await inventory_service_1.inventoryService.findAll() });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            res.status(200).json({ success: true, data: await inventory_service_1.inventoryService.findById(req.params.id) });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            res.status(200).json({ success: true, data: await inventory_service_1.inventoryService.update(req.params.id, req.body) });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            await inventory_service_1.inventoryService.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InventoryController = InventoryController;
exports.inventoryController = new InventoryController();
