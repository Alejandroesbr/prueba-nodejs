import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorizeRoles } from "../../core/middlewares/role.middleware";
import { validateMiddleware } from "../../core/middlewares/validate.middleware";
import { clinicController } from "./clinic.controller";
import { createClinicSchema, updateClinicSchema } from "./clinic.dto";

const router = Router();
const adminOnly = authorizeRoles(["ADMIN"]);
const authenticatedUsers = authorizeRoles(["ADMIN", "REQUEST_MANAGER"]);

router.use(authenticate);

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
router.post("/", adminOnly, validateMiddleware(createClinicSchema), clinicController.create.bind(clinicController));
router.get("/", authenticatedUsers, clinicController.findAll.bind(clinicController));

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
router.get("/:id", authenticatedUsers, clinicController.findById.bind(clinicController));
router.patch("/:id", adminOnly, validateMiddleware(updateClinicSchema), clinicController.update.bind(clinicController));
router.delete("/:id", adminOnly, clinicController.remove.bind(clinicController));

export default router;
