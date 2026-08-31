import { Router } from "express";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorizeRoles } from "../../core/middlewares/role.middleware";
import { validateMiddleware } from "../../core/middlewares/validate.middleware";
import { inventoryController } from "./inventory.controller";
import { createInventorySchema, updateInventorySchema } from "./inventory.dto";

const router = Router();
router.use(authenticate, authorizeRoles(["ADMIN"]));

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Medication stock per warehouse
 */
/**
 * @swagger
 * /api/v1/inventory:
 *   post:
 *     summary: Create inventory for a warehouse and medication
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [warehouseId, medicationId, quantity]
 *             properties:
 *               warehouseId: { type: string, format: uuid }
 *               medicationId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 0, example: 100 }
 *     responses:
 *       201: { description: Inventory created }
 *       400: { description: Invalid data or duplicate inventory }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *   get:
 *     summary: List active inventory records
 *     tags: [Inventory]
 *     responses:
 *       200: { description: Active inventory records }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 */
router.post("/", validateMiddleware(createInventorySchema), inventoryController.create.bind(inventoryController));
router.get("/", inventoryController.findAll.bind(inventoryController));

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get inventory by ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Inventory details }
 *       404: { description: Inventory not found }
 *   patch:
 *     summary: Update available quantity
 *     tags: [Inventory]
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
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 0, example: 200 }
 *     responses:
 *       200: { description: Inventory updated }
 *       400: { description: Invalid quantity }
 *       404: { description: Inventory not found }
 *   delete:
 *     summary: Logically delete inventory
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Inventory deleted }
 *       404: { description: Inventory not found }
 */
router.get("/:id", inventoryController.findById.bind(inventoryController));
router.patch("/:id", validateMiddleware(updateInventorySchema), inventoryController.update.bind(inventoryController));
router.delete("/:id", inventoryController.remove.bind(inventoryController));

export default router;
