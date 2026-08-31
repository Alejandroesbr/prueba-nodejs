"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clinic = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
class Clinic extends sequelize_1.Model {
}
exports.Clinic = Clinic;
Clinic.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    nit: { type: sequelize_1.DataTypes.STRING(30), allowNull: false, unique: true },
    managerName: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    managerPhone: { type: sequelize_1.DataTypes.STRING(30), allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
}, { sequelize: database_1.sequelize, tableName: "clinics", timestamps: true, underscored: true, paranoid: false });
exports.default = Clinic;
