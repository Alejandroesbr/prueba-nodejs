"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const validate_middleware_1 = require("../../core/middlewares/validate.middleware");
const clinic_controller_1 = require("./clinic.controller");
const clinic_dto_1 = require("./clinic.dto");
const router = (0, express_1.Router)();
const adminOnly = (0, role_middleware_1.authorizeRoles)(["ADMIN"]);
const authenticatedUsers = (0, role_middleware_1.authorizeRoles)(["ADMIN", "REQUEST_MANAGER"]);
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: Clinic and responsible-person management
 */
/**
 * @swagger
 * /api/v1/clinics:
 *   post:
 *     summary: Create a clinic
 *     tags: [Clinics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nit, managerName, managerPhone]
 *             properties:
 *               name: { type: string, example: Central Clinic }
 *               nit: { type: string, example: "900111222" }
 *               managerName: { type: string, example: Dr. House }
 *               managerPhone: { type: string, example: "555-1234" }
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Clinic' }
 *       400:
 *         description: Invalid data or duplicated NIT
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *   get:
 *     summary: List active clinics
 *     tags: [Clinics]
 *     responses:
 *       200:
 *         description: Active clinics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Clinic' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 */
router.post("/", adminOnly, (0, validate_middleware_1.validateMiddleware)(clinic_dto_1.createClinicSchema), clinic_controller_1.clinicController.create.bind(clinic_controller_1.clinicController));
router.get("/", authenticatedUsers, clinic_controller_1.clinicController.findAll.bind(clinic_controller_1.clinicController));
/**
 * @swagger
 * /api/v1/clinics/{id}:
 *   get:
 *     summary: Get an active clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Clinic details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Clinic' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Clinic not found }
 *   patch:
 *     summary: Update a clinic
 *     tags: [Clinics]
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
 *               name: { type: string, example: Central Clinic }
 *               nit: { type: string, example: "900111222" }
 *               managerName: { type: string, example: Dr. House }
 *               managerPhone: { type: string, example: "555-1234" }
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Clinic' }
 *       400: { description: Invalid data or duplicated NIT }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Clinic not found }
 *   delete:
 *     summary: Logically delete a clinic
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Clinic deleted successfully }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Clinic not found }
 */
router.get("/:id", authenticatedUsers, clinic_controller_1.clinicController.findById.bind(clinic_controller_1.clinicController));
router.patch("/:id", adminOnly, (0, validate_middleware_1.validateMiddleware)(clinic_dto_1.updateClinicSchema), clinic_controller_1.clinicController.update.bind(clinic_controller_1.clinicController));
router.delete("/:id", adminOnly, clinic_controller_1.clinicController.remove.bind(clinic_controller_1.clinicController));
exports.default = router;
