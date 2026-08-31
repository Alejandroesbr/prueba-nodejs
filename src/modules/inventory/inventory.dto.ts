import Joi from "joi";

export const createInventorySchema = Joi.object({
    warehouseId: Joi.string().uuid().required(),
    medicationId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(0).required(),
});

export const updateInventorySchema = Joi.object({
    quantity: Joi.number().integer().min(0).required(),
});

export interface CreateInventoryInput {
    warehouseId: string;
    medicationId: string;
    quantity: number;
}

export interface UpdateInventoryInput {
    quantity: number;
}
