"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const validate_middleware_1 = require("../../core/middlewares/validate.middleware");
const warehouse_controller_1 = require("./warehouse.controller");
const warehouse_dto_1 = require("./warehouse.dto");
const router = (0, express_1.Router)();
const adminOnly = (0, role_middleware_1.authorizeRoles)(["ADMIN"]);
const authenticatedUsers = (0, role_middleware_1.authorizeRoles)(["ADMIN", "REQUEST_MANAGER"]);
router.use(auth_middleware_1.authenticate);
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
router.post("/", adminOnly, (0, validate_middleware_1.validateMiddleware)(warehouse_dto_1.createWarehouseSchema), warehouse_controller_1.warehouseController.create.bind(warehouse_controller_1.warehouseController));
router.get("/", authenticatedUsers, warehouse_controller_1.warehouseController.findAll.bind(warehouse_controller_1.warehouseController));
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
router.get("/:id", authenticatedUsers, warehouse_controller_1.warehouseController.findById.bind(warehouse_controller_1.warehouseController));
router.patch("/:id", adminOnly, (0, validate_middleware_1.validateMiddleware)(warehouse_dto_1.updateWarehouseSchema), warehouse_controller_1.warehouseController.update.bind(warehouse_controller_1.warehouseController));
router.delete("/:id", adminOnly, warehouse_controller_1.warehouseController.remove.bind(warehouse_controller_1.warehouseController));
exports.default = router;
