import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorizeRoles } from "../../core/middlewares/role.middleware";
import { uploadSeederFiles } from "../../core/middlewares/upload.middleware";
import { seederController } from "./seeder.controller";

const router = Router();

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
router.post(
    "/upload",
    authenticate,
    authorizeRoles(["ADMIN"]),
    uploadSeederFiles,
    seederController.upload.bind(seederController),
);

export default router;
