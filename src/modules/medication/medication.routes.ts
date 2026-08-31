import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorizeRoles } from "../../core/middlewares/role.middleware";
import { validateMiddleware } from "../../core/middlewares/validate.middleware";
import { medicationController } from "./medication.controller";
import { createMedicationSchema, updateMedicationSchema } from "./medication.dto";

const router = Router();
router.use(authenticate, authorizeRoles(["ADMIN"]));

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
router.post("/", validateMiddleware(createMedicationSchema), medicationController.create.bind(medicationController));
router.get("/", medicationController.findAll.bind(medicationController));

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
router.get("/:id", medicationController.findById.bind(medicationController));
router.patch(
    "/:id",
    validateMiddleware(updateMedicationSchema),
    medicationController.update.bind(medicationController),
);
router.delete("/:id", medicationController.remove.bind(medicationController));

export default router;
