"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const validate_middleware_1 = require("../../core/middlewares/validate.middleware");
const inventory_controller_1 = require("./inventory.controller");
const inventory_dto_1 = require("./inventory.dto");
const router = (0, express_1.Router)();
const adminOnly = (0, role_middleware_1.authorizeRoles)(["ADMIN"]);
const authenticatedUsers = (0, role_middleware_1.authorizeRoles)(["ADMIN", "REQUEST_MANAGER"]);
router.use(auth_middleware_1.authenticate);
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
router.post("/", adminOnly, (0, validate_middleware_1.validateMiddleware)(inventory_dto_1.createInventorySchema), inventory_controller_1.inventoryController.create.bind(inventory_controller_1.inventoryController));
router.get("/", authenticatedUsers, inventory_controller_1.inventoryController.findAll.bind(inventory_controller_1.inventoryController));
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
router.get("/:id", authenticatedUsers, inventory_controller_1.inventoryController.findById.bind(inventory_controller_1.inventoryController));
router.patch("/:id", adminOnly, (0, validate_middleware_1.validateMiddleware)(inventory_dto_1.updateInventorySchema), inventory_controller_1.inventoryController.update.bind(inventory_controller_1.inventoryController));
router.delete("/:id", adminOnly, inventory_controller_1.inventoryController.remove.bind(inventory_controller_1.inventoryController));
exports.default = router;
