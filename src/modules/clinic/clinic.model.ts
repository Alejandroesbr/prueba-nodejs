import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/database/database";

export interface ClinicAttributes {
    id: string;
    name: string;
    nit: string;
    managerName: string;
    managerPhone: string;
    status: "ACTIVE" | "DELETED";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ClinicCreationAttributes extends Optional<ClinicAttributes, "id" | "status"> {}

export class Clinic extends Model<ClinicAttributes, ClinicCreationAttributes> implements ClinicAttributes {
    declare public id: string;
    declare public name: string;
    declare public nit: string;
    declare public managerName: string;
    declare public managerPhone: string;
    declare public status: "ACTIVE" | "DELETED";
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

Clinic.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        nit: { type: DataTypes.STRING(30), allowNull: false, unique: true },
        managerName: { type: DataTypes.STRING(150), allowNull: false },
        managerPhone: { type: DataTypes.STRING(30), allowNull: false },
        status: { type: DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
    },
    { sequelize, tableName: "clinics", timestamps: true, underscored: true, paranoid: false },
);

export default Clinic;
