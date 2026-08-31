import { Op } from "sequelize";
import { BadRequestError, NotFoundError } from "../../core/errors/custom.error";
import { CreateMedicationInput, UpdateMedicationInput } from "./medication.dto";
import Medication from "./medication.model";

export class MedicationService {
    public async create(data: CreateMedicationInput): Promise<Medication> {
        const existingMedication = await Medication.findOne({ where: { name: data.name } });
        if (existingMedication) {
            throw new BadRequestError("A medication with this name already exists");
        }
        return Medication.create(data);
    }

    public async findAll(): Promise<Medication[]> {
        return Medication.findAll({ where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]] });
    }

    public async findById(id: string): Promise<Medication> {
        const medication = await Medication.findOne({ where: { id, status: "ACTIVE" } });
        if (!medication) {
            throw new NotFoundError("Medication not found");
        }
        return medication;
    }

    public async update(id: string, data: UpdateMedicationInput): Promise<Medication> {
        const medication = await this.findById(id);
        if (data.name) {
            const duplicate = await Medication.findOne({
                where: { name: data.name, id: { [Op.ne]: id }, status: "ACTIVE" },
            });
            if (duplicate) {
                throw new BadRequestError("A medication with this name already exists");
            }
        }
        await medication.update(data);
        return medication;
    }

    public async remove(id: string): Promise<void> {
        const medication = await this.findById(id);
        await medication.update({ status: "DELETED" });
    }
}

export const medicationService = new MedicationService();
