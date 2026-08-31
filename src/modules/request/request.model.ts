import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/database/database";

export type RequestStatus = "PENDING" | "ASSIGNED" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED" | "DELETED";

export interface RequestAttributes {
    id: string;
    clinicId: string;
    medicationId: string;
    warehouseId: string;
    quantity: number;
    status: RequestStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RequestCreationAttributes extends Optional<RequestAttributes, "id" | "status"> {}

export class SupplyRequest extends Model<RequestAttributes, RequestCreationAttributes> implements RequestAttributes {
    declare public id: string;
    declare public clinicId: string;
    declare public medicationId: string;
    declare public warehouseId: string;
    declare public quantity: number;
    declare public status: RequestStatus;
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

SupplyRequest.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        clinicId: { type: DataTypes.UUID, allowNull: false },
        medicationId: { type: DataTypes.UUID, allowNull: false },
        warehouseId: { type: DataTypes.UUID, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
        status: {
            type: DataTypes.ENUM("PENDING", "ASSIGNED", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED", "DELETED"),
            allowNull: false,
            defaultValue: "PENDING",
        },
    },
    { sequelize, tableName: "requests", timestamps: true, underscored: true },
);

export default SupplyRequest;
