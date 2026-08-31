"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyRequest = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
class SupplyRequest extends sequelize_1.Model {
}
exports.SupplyRequest = SupplyRequest;
SupplyRequest.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    clinicId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    medicationId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    warehouseId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    status: {
        type: sequelize_1.DataTypes.ENUM("PENDING", "ASSIGNED", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED", "DELETED"),
        allowNull: false,
        defaultValue: "PENDING",
    },
}, { sequelize: database_1.sequelize, tableName: "requests", timestamps: true, underscored: true });
exports.default = SupplyRequest;
