// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/role/role.model.ts

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/database/database";

/**
 * 1. Total Attributes Interface
 * Defines the static type of the entire entity as it exists in the database.
 */
export interface RoleAttributes {
    id: string;
    name: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * 2. Record Creation Interface
 * Extends `Optional` to tell TypeScript which fields are NOT required
 * when calling `Role.create({...})`. `id` is auto-incremental and `description` is nullable.
 */
export interface RoleCreationAttributes extends Optional<RoleAttributes, "id" | "description"> {}

/**
 * 3. Model Class Declaration
 * Represents the Role entity. Inherits the generic methods from Sequelize (Model)
 * and implements the attributes interface to ensure autocomplete in the editor.
 */
export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    declare public id: string;
    declare public name: string;
    declare public description: string | null;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

/**
 * 4. Initializing Columns and Physical Constraints in PostgreSQL
 */
Role.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Autogenerate UUIDV4
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "The role name cannot be left blank.",
                },
            },
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "roles",
        timestamps: true,
        // Ensures snake_case column names in the database (created_at, updated_at)
        // while maintaining camelCase properties in the TypeScript code
        underscored: true,

        indexes: [{ unique: true, fields: ["name"] }],
    },
);

export default Role;
