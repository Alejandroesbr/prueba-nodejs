"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const role_middleware_1 = require("../../core/middlewares/role.middleware");
const validate_middleware_1 = require("../../core/middlewares/validate.middleware");
const request_controller_1 = require("./request.controller");
const request_dto_1 = require("./request.dto");
const router = (0, express_1.Router)();
const authenticatedRoles = [auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)(["ADMIN", "REQUEST_MANAGER"])];
/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Medication supply requests and status tracking
 */
/**
 * @swagger
 * /api/v1/requests:
 *   get:
 *     summary: List all non-deleted supply requests
 *     tags: [Requests]
 *     responses:
 *       200: { description: Supply request history }
 *       401: { description: Missing or invalid JWT }
 *   post:
 *     summary: Create a supply request and reserve inventory atomically
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicId, medicationId, warehouseId, quantity]
 *             properties:
 *               clinicId: { type: string, format: uuid }
 *               medicationId: { type: string, format: uuid }
 *               warehouseId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 1, example: 10 }
 *     responses:
 *       201: { description: Request created with PENDING status }
 *       400: { description: Invalid quantity or insufficient inventory }
 *       401: { description: Missing or invalid JWT }
 *       404: { description: Related clinic, medication or warehouse not found }
 */
router.get("/", ...authenticatedRoles, request_controller_1.requestController.findAll.bind(request_controller_1.requestController));
/**
 * @swagger
 * /api/v1/requests/active:
 *   get:
 *     summary: List active supply requests
 *     tags: [Requests]
 *     responses:
 *       200: { description: Active requests }
 *       401: { description: Missing or invalid JWT }
 */
router.get("/active", ...authenticatedRoles, request_controller_1.requestController.findActive.bind(request_controller_1.requestController));
/**
 * @swagger
 * /api/v1/requests/clinic/{clinicId}:
 *   get:
 *     summary: Get request history for a clinic
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Clinic request history }
 *       401: { description: Missing or invalid JWT }
 *       404: { description: Clinic not found }
 */
router.get("/clinic/:clinicId", ...authenticatedRoles, request_controller_1.requestController.findByClinic.bind(request_controller_1.requestController));
/**
 * @swagger
 * /api/v1/requests/{id}:
 *   get:
 *     summary: Get a supply request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Supply request details }
 *       401: { description: Missing or invalid JWT }
 *       404: { description: Supply request not found }
 *   delete:
 *     summary: Logically delete a supply request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Supply request deleted }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Supply request not found }
 */
router.get("/:id", ...authenticatedRoles, request_controller_1.requestController.findById.bind(request_controller_1.requestController));
router.post("/", ...authenticatedRoles, (0, validate_middleware_1.validateMiddleware)(request_dto_1.createRequestSchema), request_controller_1.requestController.create.bind(request_controller_1.requestController));
/**
 * @swagger
 * /api/v1/requests/{id}/assign:
 *   patch:
 *     summary: Assign a pending request to a warehouse and transfer its reservation
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
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
 *             required: [warehouseId]
 *             properties:
 *               warehouseId: { type: string, format: uuid }
 *     responses:
 *       200: { description: Request assigned and inventory reservation transferred }
 *       400: { description: Invalid state or insufficient inventory }
 *       401: { description: Missing or invalid JWT }
 *       403: { description: User is not an administrator }
 *       404: { description: Request or warehouse not found }
 */
router.patch("/:id/assign", auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)(["ADMIN"]), (0, validate_middleware_1.validateMiddleware)(request_dto_1.assignRequestSchema), request_controller_1.requestController.assign.bind(request_controller_1.requestController));
/**
 * @swagger
 * /api/v1/requests/{id}/status:
 *   patch:
 *     summary: Update a supply request status
 *     tags: [Requests]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED]
 *                 example: APPROVED
 *     responses:
 *       200: { description: Status updated }
 *       400: { description: Invalid status or transition }
 *       401: { description: Missing or invalid JWT }
 *       404: { description: Supply request not found }
 */
router.patch("/:id/status", ...authenticatedRoles, (0, validate_middleware_1.validateMiddleware)(request_dto_1.updateRequestStatusSchema), request_controller_1.requestController.updateStatus.bind(request_controller_1.requestController));
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorizeRoles)(["ADMIN"]), request_controller_1.requestController.remove.bind(request_controller_1.requestController));
exports.default = router;
