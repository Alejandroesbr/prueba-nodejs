"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/utils/jwt.util.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
/**
 * Generates a signed cryptographic token.
 *
 * @param payload User data that will be encrypted and included in the token.
 * @returns A string representing the signed JWT.
 */
const generateToken = (payload) => {
    const options = {
        algorithm: "HS256",
        expiresIn: env_config_1.ENV.JWT_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, env_config_1.ENV.JWT_SECRET, options);
};
exports.generateToken = generateToken;
/**
 * Decrypts a token and verifies its authenticity and validity.
 *
 * @param token The JWT sent by the client.
 * @returns The decoded data object (JwtPayload).
 * @throws JsonWebTokenError if the signature is invalid, or TokenExpiredError if it has expired.
 */
const verifyToken = (token) => {
    // CRITICAL SECURITY MEASURE:
    // We explicitly force the ‘HS256’ algorithm.
    // This prevents an “Algorithm Confusion Attack,”
    // in which an attacker sends a modified token with the header { “alg”: “none” }..
    const options = {
        algorithms: ["HS256"],
    };
    const decoded = jsonwebtoken_1.default.verify(token, env_config_1.ENV.JWT_SECRET, options);
    if (!isJwtPayload(decoded)) {
        throw new jsonwebtoken_1.default.JsonWebTokenError("Invalid JWT payload");
    }
    return decoded;
};
exports.verifyToken = verifyToken;
const isJwtPayload = (payload) => {
    return (typeof payload !== "string" &&
        typeof payload.userId === "string" &&
        payload.userId.length > 0 &&
        typeof payload.roleName === "string" &&
        (payload.roleName === "ADMIN" || payload.roleName === "REQUEST_MANAGER"));
};
