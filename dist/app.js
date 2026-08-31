"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./core/config/swagger.config");
const custom_error_1 = require("./core/errors/custom.error");
const error_middleware_1 = require("./core/middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const clinic_routes_1 = __importDefault(require("./modules/clinic/clinic.routes"));
const medication_routes_1 = __importDefault(require("./modules/medication/medication.routes"));
const inventory_routes_1 = __importDefault(require("./modules/inventory/inventory.routes"));
const request_routes_1 = __importDefault(require("./modules/request/request.routes"));
const seeder_routes_1 = __importDefault(require("./modules/seeders/seeder.routes"));
const warehouse_routes_1 = __importDefault(require("./modules/warehouse/warehouse.routes"));
const app = (0, express_1.default)();
//  Middlewares Base
app.use(express_1.default.json());
// Doc Swagger
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec, {
    swaggerOptions: {
        operationsSorter: "method",
    },
}));
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/clinics", clinic_routes_1.default);
app.use("/api/v1/warehouses", warehouse_routes_1.default);
app.use("/api/v1/medications", medication_routes_1.default);
app.use("/api/v1/inventory", inventory_routes_1.default);
app.use("/api/v1/requests", request_routes_1.default);
app.use("/api/v1/seeders", seeder_routes_1.default);
app.use("*", (req, _res, next) => {
    next(new custom_error_1.NotFoundError(`La ruta ${req.originalUrl} no existe en este servidor`));
});
// Catches both the 404 errors mentioned above and any `next(error)` thrown from controllers or services.
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
