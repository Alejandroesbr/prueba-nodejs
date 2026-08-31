import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/database/database";

export interface InventoryAttributes {
    id: string;
    warehouseId: string;
    medicationId: string;
    quantity: number;
    status: "ACTIVE" | "DELETED";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id" | "status"> {}

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    declare public id: string;
    declare public warehouseId: string;
    declare public medicationId: string;
    declare public quantity: number;
    declare public status: "ACTIVE" | "DELETED";
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

Inventory.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        warehouseId: { type: DataTypes.UUID, allowNull: false },
        medicationId: { type: DataTypes.UUID, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0, isInt: true } },
        status: { type: DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
    },
    {
        sequelize,
        tableName: "inventory",
        timestamps: true,
        underscored: true,
        indexes: [{ unique: true, fields: ["warehouse_id", "medication_id"] }],
    },
);

export default Inventory;
