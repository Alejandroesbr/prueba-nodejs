import Joi from "joi";

export const createMedicationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    description: Joi.string().trim().max(255).allow(null, ""),
});

export const updateMedicationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150),
    description: Joi.string().trim().max(255).allow(null, ""),
}).min(1);

export interface CreateMedicationInput {
    name: string;
    description?: string | null;
}

export type UpdateMedicationInput = Partial<CreateMedicationInput>;
