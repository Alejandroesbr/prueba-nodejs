// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/utils/hash.util.ts

import bcrypt from "bcrypt";

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

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password with a previously generated hash.
 * Uses a constant-time comparison algorithm to mitigate timing attacks.
 * @param password - The plaintext password entered during login
 * @param hash - The hash stored in the database
 * @returns A Promise that resolves to true or false depending on whether the password matches.
 */

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
