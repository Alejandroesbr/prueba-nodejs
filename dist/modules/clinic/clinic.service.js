"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicService = exports.ClinicService = void 0;
const sequelize_1 = require("sequelize");
const custom_error_1 = require("../../core/errors/custom.error");
const clinic_model_1 = __importDefault(require("./clinic.model"));
class ClinicService {
    async create(data) {
        const existingClinic = await clinic_model_1.default.findOne({ where: { nit: data.nit } });
        if (existingClinic) {
            if (existingClinic.status === "DELETED") {
                await existingClinic.update({ ...data, status: "ACTIVE" });
                return existingClinic;
            }
            throw new custom_error_1.BadRequestError("A clinic with this NIT already exists");
        }
        return clinic_model_1.default.create(data);
    }
    async findAll() {
        return clinic_model_1.default.findAll({ where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]] });
    }
    async findById(id) {
        const clinic = await clinic_model_1.default.findOne({ where: { id, status: "ACTIVE" } });
        if (!clinic) {
            throw new custom_error_1.NotFoundError("Clinic not found");
        }
        return clinic;
    }
    async update(id, data) {
        const clinic = await this.findById(id);
        if (data.nit) {
            const duplicate = await clinic_model_1.default.findOne({ where: { nit: data.nit, id: { [sequelize_1.Op.ne]: id }, status: "ACTIVE" } });
            if (duplicate) {
                throw new custom_error_1.BadRequestError("A clinic with this NIT already exists");
            }
        }
        await clinic.update(data);
        return clinic;
    }
    async remove(id) {
        const clinic = await this.findById(id);
        await clinic.update({ status: "DELETED" });
    }
}
exports.ClinicService = ClinicService;
exports.clinicService = new ClinicService();
