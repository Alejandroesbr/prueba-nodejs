import Joi from "joi";
import { RequestStatus } from "./request.model";

export const createRequestSchema = Joi.object({
    clinicId: Joi.string().uuid().required(),
    medicationId: Joi.string().uuid().required(),
    warehouseId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required(),
});

export const updateRequestStatusSchema = Joi.object({
    status: Joi.string().valid("APPROVED", "REJECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED").required(),
});

export const assignRequestSchema = Joi.object({
    warehouseId: Joi.string().uuid().required(),
});

export interface CreateRequestInput {
    clinicId: string;
    medicationId: string;
    warehouseId: string;
    quantity: number;
}

export interface UpdateRequestStatusInput {
    status: RequestStatus;
}

export interface AssignRequestInput {
    warehouseId: string;
}
