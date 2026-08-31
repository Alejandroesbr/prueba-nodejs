"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../core/middlewares/validate.middleware");
const auth_controller_1 = require("./auth.controller");
const auth_dto_1 = require("./auth.dto");
const router = (0, express_1.Router)();
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
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post("/register", (0, validate_middleware_1.validateMiddleware)(auth_dto_1.registerSchema), auth_controller_1.authController.register.bind(auth_controller_1.authController));
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
 *         description: Login successful, returns JWT
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", (0, validate_middleware_1.validateMiddleware)(auth_dto_1.loginSchema), auth_controller_1.authController.login.bind(auth_controller_1.authController));
exports.default = router;
