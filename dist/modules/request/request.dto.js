"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRequestSchema = exports.updateRequestStatusSchema = exports.createRequestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRequestSchema = joi_1.default.object({
    clinicId: joi_1.default.string().uuid().required(),
    medicationId: joi_1.default.string().uuid().required(),
    warehouseId: joi_1.default.string().uuid().required(),
    quantity: joi_1.default.number().integer().min(1).required(),
});
exports.updateRequestStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid("APPROVED", "REJECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED").required(),
});
exports.assignRequestSchema = joi_1.default.object({
    warehouseId: joi_1.default.string().uuid().required(),
});
