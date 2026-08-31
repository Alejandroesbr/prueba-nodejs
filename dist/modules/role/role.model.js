"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/role/role.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
/**
 * 3. Model Class Declaration
 * Represents the Role entity. Inherits the generic methods from Sequelize (Model)
 * and implements the attributes interface to ensure autocomplete in the editor.
 */
class Role extends sequelize_1.Model {
}
exports.Role = Role;
/**
 * 4. Initializing Columns and Physical Constraints in PostgreSQL
 */
Role.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Autogenerate UUIDV4
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "The role name cannot be left blank.",
            },
        },
    },
    description: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "roles",
    timestamps: true,
    // Ensures snake_case column names in the database (created_at, updated_at)
    // while maintaining camelCase properties in the TypeScript code
    underscored: true,
    indexes: [{ unique: true, fields: ["name"] }],
});
exports.default = Role;
