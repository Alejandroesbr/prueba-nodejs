"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
class Inventory extends sequelize_1.Model {
}
exports.Inventory = Inventory;
Inventory.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    warehouseId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    medicationId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, isInt: true } },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
}, {
    sequelize: database_1.sequelize,
    tableName: "inventory",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["warehouse_id", "medication_id"] }],
});
exports.default = Inventory;
