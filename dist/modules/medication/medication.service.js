"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicationService = exports.MedicationService = void 0;
const sequelize_1 = require("sequelize");
const custom_error_1 = require("../../core/errors/custom.error");
const medication_model_1 = __importDefault(require("./medication.model"));
class MedicationService {
    async create(data) {
        const existingMedication = await medication_model_1.default.findOne({ where: { name: data.name } });
        if (existingMedication) {
            if (existingMedication.status === "DELETED") {
                await existingMedication.update({ ...data, status: "ACTIVE" });
                return existingMedication;
            }
            throw new custom_error_1.BadRequestError("A medication with this name already exists");
        }
        return medication_model_1.default.create(data);
    }
    async findAll() {
        return medication_model_1.default.findAll({ where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]] });
    }
    async findById(id) {
        const medication = await medication_model_1.default.findOne({ where: { id, status: "ACTIVE" } });
        if (!medication) {
            throw new custom_error_1.NotFoundError("Medication not found");
        }
        return medication;
    }
    async update(id, data) {
        const medication = await this.findById(id);
        if (data.name) {
            const duplicate = await medication_model_1.default.findOne({
                where: { name: data.name, id: { [sequelize_1.Op.ne]: id }, status: "ACTIVE" },
            });
            if (duplicate) {
                throw new custom_error_1.BadRequestError("A medication with this name already exists");
            }
        }
        await medication.update(data);
        return medication;
    }
    async remove(id) {
        const medication = await this.findById(id);
        await medication.update({ status: "DELETED" });
    }
}
exports.MedicationService = MedicationService;
exports.medicationService = new MedicationService();
