import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/core/database/database";
import { setupDatabase } from "../src/core/database/setup.models";
import { seedRoles } from "../src/modules/role/role.seeder";
import Clinic from "../src/modules/clinic/clinic.model";
import Inventory from "../src/modules/inventory/inventory.model";
import Medication from "../src/modules/medication/medication.model";
import Warehouse from "../src/modules/warehouse/warehouse.model";

const clinicId = "b3b07384-d113-4ec2-a25e-336c091324a1";
const warehouseId = "d3b07384-d113-4ec2-a25e-336c091324a1";
const medicationId = "8f8e0273-e8b7-4ca1-a8ec-aed30b5da249";

describe("Supply Requests Integration Tests", () => {
    let adminToken: string;

    beforeAll(async () => {
        await setupDatabase();
        await sequelize.sync({ force: true });
        await seedRoles();

        await Promise.all([
            Clinic.create({
                id: clinicId,
                name: "Test Clinic",
                nit: "900999888",
                managerName: "Test Manager",
                managerPhone: "5559999",
            }),
            Warehouse.create({ id: warehouseId, name: "Test Warehouse", location: "Test Location" }),
            Medication.create({ id: medicationId, name: "Test Medication", description: "Test" }),
        ]);
        await Inventory.create({ warehouseId, medicationId, quantity: 0 });

        await request(app).post("/api/v1/auth/register").send({
            email: "admin-test@riwimedicare.com",
            password: "Password123!",
            roleName: "ADMIN",
        });

        const loginResponse = await request(app).post("/api/v1/auth/login").send({
            email: "admin-test@riwimedicare.com",
            password: "Password123!",
        });
        adminToken = loginResponse.body.data.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("rejects a request when inventory is insufficient", async () => {
        const response = await request(app)
            .post("/api/v1/requests")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ clinicId, medicationId, warehouseId, quantity: 1 });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe("BAD_REQUEST");
        expect(response.body.message).toBe("Insufficient inventory");
    });

    it("rejects a request with a quantity less than or equal to zero", async () => {
        const response = await request(app)
            .post("/api/v1/requests")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ clinicId, medicationId, warehouseId, quantity: 0 });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.code).toBe("BAD_REQUEST");
        expect(response.body.details).toEqual(expect.arrayContaining([expect.objectContaining({ field: "quantity" })]));
    });

    it("rejects protected requests without authentication", async () => {
        const response = await request(app).get("/api/v1/requests");

        expect(response.status).toBe(401);
        expect(response.body.code).toBe("UNAUTHORIZED");
    });

    it("rejects a malformed bearer token", async () => {
        const response = await request(app).get("/api/v1/requests").set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(401);
        expect(response.body.code).toBe("UNAUTHORIZED");
    });

    it("rejects registration with an unsupported role", async () => {
        const response = await request(app).post("/api/v1/auth/register").send({
            email: "invalid-role@riwimedicare.com",
            password: "Password123!",
            roleName: "SUPER_ADMIN",
        });

        expect(response.status).toBe(400);
        expect(response.body.details).toEqual(expect.arrayContaining([expect.objectContaining({ field: "roleName" })]));
    });

    it("creates a request and restores inventory when it is rejected", async () => {
        await Inventory.update({ quantity: 5 }, { where: { warehouseId, medicationId } });

        const createResponse = await request(app)
            .post("/api/v1/requests")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ clinicId, medicationId, warehouseId, quantity: 2 });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.data.status).toBe("PENDING");

        const rejectResponse = await request(app)
            .patch(`/api/v1/requests/${createResponse.body.data.id}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "REJECTED" });

        expect(rejectResponse.status).toBe(200);
        expect(rejectResponse.body.data.status).toBe("REJECTED");

        const inventory = await Inventory.findOne({ where: { warehouseId, medicationId } });
        expect(inventory?.quantity).toBe(5);

        const invalidTransitionResponse = await request(app)
            .patch(`/api/v1/requests/${createResponse.body.data.id}/status`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ status: "COMPLETED" });

        expect(invalidTransitionResponse.status).toBe(400);
        expect(invalidTransitionResponse.body.message).toContain("Invalid status transition");
    });
});
