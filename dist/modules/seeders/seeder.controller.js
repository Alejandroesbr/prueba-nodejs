"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seederController = exports.SeederController = void 0;
const seeder_service_1 = require("./seeder.service");
class SeederController {
    async upload(req, res, next) {
        try {
            const files = req.files ?? [];
            const result = await seeder_service_1.seederService.load(files);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SeederController = SeederController;
exports.seederController = new SeederController();
