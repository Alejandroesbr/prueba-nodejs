// /home/Coder/prueba-nodejs/api-riwimedicare/src/app.ts

import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./core/config/swagger.config";
import { NotFoundError } from "./core/errors/custom.error";
import { errorMiddleware } from "./core/middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import clinicRoutes from "./modules/clinic/clinic.routes";
import medicationRoutes from "./modules/medication/medication.routes";
import warehouseRoutes from "./modules/warehouse/warehouse.routes";

const app: Application = express();

//  Middlewares Base
app.use(express.json());

// Doc Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            operationsSorter: "method",
        },
    }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/warehouses", warehouseRoutes);
app.use("/api/v1/medications", medicationRoutes);

app.use("*", (req, res, next) => {
    next(new NotFoundError(`La ruta ${req.originalUrl} no existe en este servidor`));
});

// Catches both the 404 errors mentioned above and any `next(error)` thrown from controllers or services.
app.use(errorMiddleware);

export default app;
