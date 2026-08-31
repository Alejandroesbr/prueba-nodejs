"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const validate_middleware_1 = require("../../core/middlewares/validate.middleware");
const medication_controller_1 = require("./medication.controller");
const medication_dto_1 = require("./medication.dto");
const router = (0, express_1.Router)();
const adminOnly = (0, role_middleware_1.authorizeRoles)(["ADMIN"]);
const authenticatedUsers = (0, role_middleware_1.authorizeRoles)(["ADMIN", "REQUEST_MANAGER"]);
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Medications
 *   description: Medication catalogue management
 */
/**
 * @swagger
 * /api/v1/medications:
 *   post:
 *     summary: Create a medication
 *     tags: [Medications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Paracetamol 500mg }
 *               description: { type: string, nullable: true, example: Common pain reliever }
 *     responses:
 *       201:
 *         description: Medication created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Medication' }
 *       400: { description: Invalid data or duplicated medication name }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *   get:
 *     summary: List active medications
 *     tags: [Medications]
 *     responses:
 *       200:
 *         description: Active medications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Medication' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 */
router.post("/", authenticatedUsers, (0, validate_middleware_1.validateMiddleware)(medication_dto_1.createMedicationSchema), medication_controller_1.medicationController.create.bind(medication_controller_1.medicationController));
router.get("/", authenticatedUsers, medication_controller_1.medicationController.findAll.bind(medication_controller_1.medicationController));
/**
 * @swagger
 * /api/v1/medications/{id}:
 *   get:
 *     summary: Get an active medication by ID
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Medication details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Medication' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Medication not found }
 *   patch:
 *     summary: Update a medication
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: Paracetamol 500mg }
 *               description: { type: string, nullable: true, example: Common pain reliever }
 *     responses:
 *       200:
 *         description: Medication updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Medication' }
 *       400: { description: Invalid data or duplicated medication name }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Medication not found }
 *   delete:
 *     summary: Logically delete a medication
 *     tags: [Medications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Medication deleted successfully }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Medication not found }
 */
router.get("/:id", authenticatedUsers, medication_controller_1.medicationController.findById.bind(medication_controller_1.medicationController));
router.patch("/:id", authenticatedUsers, (0, validate_middleware_1.validateMiddleware)(medication_dto_1.updateMedicationSchema), medication_controller_1.medicationController.update.bind(medication_controller_1.medicationController));
router.delete("/:id", adminOnly, medication_controller_1.medicationController.remove.bind(medication_controller_1.medicationController));
exports.default = router;
