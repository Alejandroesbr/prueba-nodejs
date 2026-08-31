import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorizeRoles } from "../../core/middlewares/role.middleware";
import { validateMiddleware } from "../../core/middlewares/validate.middleware";
import { warehouseController } from "./warehouse.controller";
import { createWarehouseSchema, updateWarehouseSchema } from "./warehouse.dto";

const router = Router();
router.use(authenticate, authorizeRoles(["ADMIN"]));

/**
 * @swagger
 * tags:
 *   name: Warehouses
 *   description: Warehouse management
 */
/**
 * @swagger
 * /api/v1/warehouses:
 *   post:
 *     summary: Create a warehouse
 *     tags: [Warehouses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name: { type: string, example: North warehouse }
 *               location: { type: string, example: Industrial warehouse 4 }
 *     responses:
 *       201:
 *         description: Warehouse created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Warehouse' }
 *       400: { description: Invalid data }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *   get:
 *     summary: List active warehouses
 *     tags: [Warehouses]
 *     responses:
 *       200:
 *         description: Active warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Warehouse' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 */
router.post("/", validateMiddleware(createWarehouseSchema), warehouseController.create.bind(warehouseController));
router.get("/", warehouseController.findAll.bind(warehouseController));

/**
 * @swagger
 * /api/v1/warehouses/{id}:
 *   get:
 *     summary: Get an active warehouse by ID
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Warehouse details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Warehouse' }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Warehouse not found }
 *   patch:
 *     summary: Update a warehouse
 *     tags: [Warehouses]
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
 *               name: { type: string, example: North warehouse }
 *               location: { type: string, example: Industrial warehouse 4 }
 *     responses:
 *       200:
 *         description: Warehouse updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Warehouse' }
 *       400: { description: Invalid data }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Warehouse not found }
 *   delete:
 *     summary: Logically delete a warehouse
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Warehouse deleted successfully }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Warehouse not found }
 */
router.get("/:id", warehouseController.findById.bind(warehouseController));
router.patch("/:id", validateMiddleware(updateWarehouseSchema), warehouseController.update.bind(warehouseController));
router.delete("/:id", warehouseController.remove.bind(warehouseController));

export default router;
