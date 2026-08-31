import Joi from "joi";

export const createClinicSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    nit: Joi.string().trim().min(3).max(30).required(),
    managerName: Joi.string().trim().min(2).max(150).required(),
    managerPhone: Joi.string().trim().min(7).max(30).required(),
});

export const updateClinicSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150),
    nit: Joi.string().trim().min(3).max(30),
    managerName: Joi.string().trim().min(2).max(150),
    managerPhone: Joi.string().trim().min(7).max(30),
}).min(1);

export interface CreateClinicInput {
    name: string;
    nit: string;
    managerName: string;
    managerPhone: string;
}

export type UpdateClinicInput = Partial<CreateClinicInput>;
