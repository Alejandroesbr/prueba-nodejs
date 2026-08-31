// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.routes.ts

import { Router } from "express";
import { validateMiddleware } from "../../core/middlewares/validate.middleware";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.dto";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login operations
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *               roleName:
 *                 type: string
 *                 enum: [ADMIN, REQUEST_MANAGER]
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User successfully registered }
 *                 data: { $ref: '#/components/schemas/User' }
 *       400: { description: Validation error or email already exists }
 */
router.post("/register", validateMiddleware(registerSchema), authController.register.bind(authController));

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and get JWT
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful and JWT issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Login successful }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *                     token: { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *       400: { description: Validation error }
 *       401: { description: Invalid credentials }
 */
router.post("/login", validateMiddleware(loginSchema), authController.login.bind(authController));

export default router;
