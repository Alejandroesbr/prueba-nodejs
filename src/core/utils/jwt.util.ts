// /home/Coder/prueba-nodejs/api-riwimedicare/src/core/utils/jwt.util.ts

import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { ENV } from "../config/env.config";

/**
 * Strict contract for the contents of our token.
 * Storing the ‘roleName’ here avoids database queries (JOINs)
 * on every protected request.
 */
export interface JwtPayload {
    userId: string;
    roleName: string;
}

/**
 * Generates a signed cryptographic token.
 *
 * @param payload User data that will be encrypted and included in the token.
 * @returns A string representing the signed JWT.
 */
export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        algorithm: "HS256",
        expiresIn: ENV.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, ENV.JWT_SECRET, options);
};

/**
 * Decrypts a token and verifies its authenticity and validity.
 *
 * @param token The JWT sent by the client.
 * @returns The decoded data object (JwtPayload).
 * @throws JsonWebTokenError if the signature is invalid, or TokenExpiredError if it has expired.
 */
export const verifyToken = (token: string): JwtPayload => {
    // CRITICAL SECURITY MEASURE:
    // We explicitly force the ‘HS256’ algorithm.
    // This prevents an “Algorithm Confusion Attack,”
    // in which an attacker sends a modified token with the header { “alg”: “none” }..
    const options: VerifyOptions = {
        algorithms: ["HS256"],
    };

    const decoded = jwt.verify(token, ENV.JWT_SECRET, options);

    return decoded as JwtPayload;
};
