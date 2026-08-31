"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const upload_middleware_1 = require("../../core/middlewares/upload.middleware");
const seeder_controller_1 = require("./seeder.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Seeders
 *   description: Transactional bulk loading of base JSON data
 */
/**
 * @swagger
 * /api/v1/seeders/upload:
 *   post:
 *     summary: Upload base data JSON files
 *     tags: [Seeders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: roles.json, users.json, clinics.json, warehouses.json, medications.json or inventory.json
 *     responses:
 *       200: { description: Files processed idempotently in one transaction }
 *       400: { description: Invalid JSON, file name, field or data }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 */
router.post("/upload", auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)(["ADMIN"]), upload_middleware_1.uploadSeederFiles, seeder_controller_1.seederController.upload.bind(seeder_controller_1.seederController));
exports.default = router;
