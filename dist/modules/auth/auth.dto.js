"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.dto.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * registerSchema
 *
 * Strict: Ensures that new users provide secure credentials and select a role
 * before interacting with the database or using CPU resources for hashing (bcrypt).
 */
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "The email format is invalid.",
        "any.required": "Email is a required field.",
    }),
    password: joi_1.default.string()
        .min(8)
        // The regular expression /[1-9]/ requires the presence of at least one digit
        .pattern(/[1-9]/)
        .required()
        .messages({
        "string.min": "The password must be at least 8 characters long.",
        "string.pattern.base": "The password must contain at least one number (0-9).",
        "any.required": "The password is a required field.",
    }),
    roleName: joi_1.default.string().required().messages({
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
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "The email format is invalid.",
        "any.required": "Email is a required field.",
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "The password is a required field.",
    }),
});
