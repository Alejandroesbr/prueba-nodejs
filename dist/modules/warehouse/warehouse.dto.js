"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWarehouseSchema = exports.createWarehouseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createWarehouseSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(150).required(),
    location: joi_1.default.string().trim().min(2).max(255).required(),
});
exports.updateWarehouseSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(150),
    location: joi_1.default.string().trim().min(2).max(255),
}).min(1);
