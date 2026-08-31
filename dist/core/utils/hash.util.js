"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/utils/hash.util.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Computational cost factor (Salt Rounds).
 * A value of 12 represents 2^12 (4096) iterations of the algorithm, providing
 * an optimal balance between computation time (~250–350 ms) and resistance
 * to brute-force attacks using specialized hardware (GPU/ASIC).
 */
const SALT_ROUNDS = 12;
/**
 * Converts a plaintext password into a secure hash using bcrypt.
 *
 * @param password - The plaintext password to be hashed.
 * @returns A promise that resolves to the password hash.
 */
const hashPassword = async (password) => {
    return await bcrypt_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
/**
 * Compares a plaintext password with a previously generated hash.
 * Uses a constant-time comparison algorithm to mitigate timing attacks.
 * @param password - The plaintext password entered during login
 * @param hash - The hash stored in the database
 * @returns A Promise that resolves to true or false depending on whether the password matches.
 */
const comparePassword = async (password, hash) => {
    return await bcrypt_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
