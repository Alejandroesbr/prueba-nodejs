"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicationSchema = exports.createMedicationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createMedicationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(150).required(),
    description: joi_1.default.string().trim().max(255).allow(null, ""),
});
exports.updateMedicationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(150),
    description: joi_1.default.string().trim().max(255).allow(null, ""),
}).min(1);
