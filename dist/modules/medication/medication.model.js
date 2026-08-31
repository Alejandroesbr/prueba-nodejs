"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medication = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
class Medication extends sequelize_1.Model {
}
exports.Medication = Medication;
Medication.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(150), allowNull: false, unique: true },
    description: { type: sequelize_1.DataTypes.STRING(255), allowNull: true },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
}, { sequelize: database_1.sequelize, tableName: "medications", timestamps: true, underscored: true });
exports.default = Medication;
