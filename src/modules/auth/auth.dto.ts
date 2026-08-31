// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.dto.ts

import Joi from "joi";

/**
 * registerSchema
 *
 * Strict: Ensures that new users provide secure credentials and select a role
 * before interacting with the database or using CPU resources for hashing (bcrypt).
 */
export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "The email format is invalid.",
        "any.required": "Email is a required field.",
    }),

    password: Joi.string()
        .min(8)
        // The regular expression /[1-9]/ requires the presence of at least one digit
        .pattern(/[1-9]/)
        .required()
        .messages({
            "string.min": "The password must be at least 8 characters long.",
            "string.pattern.base": "The password must contain at least one number (0-9).",
            "any.required": "The password is a required field.",
        }),

    roleName: Joi.string().required().messages({
        "any.required": "The roleName is a required field.",
        "string.empty": "The roleName cannot be empty.",
    }),
});

/**
 * loginSchema
 *
 * Lenient: Its sole function is to verify that the fields exist and have
 * a valid initial format in order to attempt to find the account in the database.
 * Length and format rules are not re-evaluated here.
 */
export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "The email format is invalid.",
        "any.required": "Email is a required field.",
    }),

    password: Joi.string().required().messages({
        "any.required": "The password is a required field.",
    }),
});
