"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
class Warehouse extends sequelize_1.Model {
}
exports.Warehouse = Warehouse;
Warehouse.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    location: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
}, { sequelize: database_1.sequelize, tableName: "warehouses", timestamps: true, underscored: true });
exports.default = Warehouse;
