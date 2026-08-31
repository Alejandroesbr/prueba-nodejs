"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventorySchema = exports.createInventorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createInventorySchema = joi_1.default.object({
    warehouseId: joi_1.default.string().uuid().required(),
    medicationId: joi_1.default.string().uuid().required(),
    quantity: joi_1.default.number().integer().min(0).required(),
});
exports.updateInventorySchema = joi_1.default.object({
    quantity: joi_1.default.number().integer().min(0).required(),
});
