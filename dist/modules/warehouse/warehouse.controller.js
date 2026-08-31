"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseController = exports.WarehouseController = void 0;
const warehouse_service_1 = require("./warehouse.service");
class WarehouseController {
    async create(req, res, next) {
        try {
            const warehouse = await warehouse_service_1.warehouseService.create(req.body);
            res.status(201).json({ success: true, data: warehouse });
        }
        catch (error) {
            next(error);
        }
    }
    async findAll(_req, res, next) {
        try {
            const warehouses = await warehouse_service_1.warehouseService.findAll();
            res.status(200).json({ success: true, data: warehouses });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const warehouse = await warehouse_service_1.warehouseService.findById(req.params.id);
            res.status(200).json({ success: true, data: warehouse });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const warehouse = await warehouse_service_1.warehouseService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: warehouse });
        }
        catch (error) {
            next(error);
        }
    }
    async remove(req, res, next) {
        try {
            await warehouse_service_1.warehouseService.remove(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WarehouseController = WarehouseController;
exports.warehouseController = new WarehouseController();
