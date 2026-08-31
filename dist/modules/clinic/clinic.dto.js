"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClinicSchema = exports.createClinicSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createClinicSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(150).required(),
    nit: joi_1.default.string().trim().min(3).max(30).required(),
    managerName: joi_1.default.string().trim().min(2).max(150).required(),
    managerPhone: joi_1.default.string().trim().min(7).max(30).required(),
});
exports.updateClinicSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(150),
    nit: joi_1.default.string().trim().min(3).max(30),
    managerName: joi_1.default.string().trim().min(2).max(150),
    managerPhone: joi_1.default.string().trim().min(7).max(30),
}).min(1);
