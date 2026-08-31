import Joi from "joi";

export const createWarehouseSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    location: Joi.string().trim().min(2).max(255).required(),
});

export const updateWarehouseSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150),
    location: Joi.string().trim().min(2).max(255),
}).min(1);

export interface CreateWarehouseInput {
    name: string;
    location: string;
}

export type UpdateWarehouseInput = Partial<CreateWarehouseInput>;
