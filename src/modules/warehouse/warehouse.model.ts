import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/database/database";

export interface WarehouseAttributes {
    id: string;
    name: string;
    location: string;
    status: "ACTIVE" | "DELETED";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, "id" | "status"> {}

export class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
    declare public id: string;
    declare public name: string;
    declare public location: string;
    declare public status: "ACTIVE" | "DELETED";
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

Warehouse.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        location: { type: DataTypes.STRING(255), allowNull: false },
        status: { type: DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
    },
    { sequelize, tableName: "warehouses", timestamps: true, underscored: true },
);

export default Warehouse;
