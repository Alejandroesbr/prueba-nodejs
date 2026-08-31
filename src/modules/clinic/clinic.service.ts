import { Op } from "sequelize";
import { BadRequestError, NotFoundError } from "../../core/errors/custom.error";
import { CreateClinicInput, UpdateClinicInput } from "./clinic.dto";
import Clinic from "./clinic.model";

export class ClinicService {
    public async create(data: CreateClinicInput): Promise<Clinic> {
        const existingClinic = await Clinic.findOne({ where: { nit: data.nit } });
        if (existingClinic) {
            if (existingClinic.status === "DELETED") {
                await existingClinic.update({ ...data, status: "ACTIVE" });
                return existingClinic;
            }
            throw new BadRequestError("A clinic with this NIT already exists");
        }
        return Clinic.create(data);
    }

    public async findAll(): Promise<Clinic[]> {
        return Clinic.findAll({ where: { status: "ACTIVE" }, order: [["createdAt", "DESC"]] });
    }

    public async findById(id: string): Promise<Clinic> {
        const clinic = await Clinic.findOne({ where: { id, status: "ACTIVE" } });
        if (!clinic) {
            throw new NotFoundError("Clinic not found");
        }
        return clinic;
    }

    public async update(id: string, data: UpdateClinicInput): Promise<Clinic> {
        const clinic = await this.findById(id);
        if (data.nit) {
            const duplicate = await Clinic.findOne({ where: { nit: data.nit, id: { [Op.ne]: id }, status: "ACTIVE" } });
            if (duplicate) {
                throw new BadRequestError("A clinic with this NIT already exists");
            }
        }
        await clinic.update(data);
        return clinic;
    }

    public async remove(id: string): Promise<void> {
        const clinic = await this.findById(id);
        await clinic.update({ status: "DELETED" });
    }
}

export const clinicService = new ClinicService();
