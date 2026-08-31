import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../core/database/database";

export interface MedicationAttributes {
    id: string;
    name: string;
    description?: string | null;
    status: "ACTIVE" | "DELETED";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MedicationCreationAttributes extends Optional<MedicationAttributes, "id" | "description" | "status"> {}

export class Medication
    extends Model<MedicationAttributes, MedicationCreationAttributes>
    implements MedicationAttributes
{
    declare public id: string;
    declare public name: string;
    declare public description: string | null;
    declare public status: "ACTIVE" | "DELETED";
    declare public readonly createdAt: Date;
    declare public readonly updatedAt: Date;
}

Medication.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(150), allowNull: false, unique: true },
        description: { type: DataTypes.STRING(255), allowNull: true },
        status: { type: DataTypes.ENUM("ACTIVE", "DELETED"), allowNull: false, defaultValue: "ACTIVE" },
    },
    { sequelize, tableName: "medications", timestamps: true, underscored: true },
);

export default Medication;
