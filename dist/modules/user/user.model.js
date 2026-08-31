"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/user/user.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../core/database/database");
/**
 * 3. Model Class Declaration
 */
class User extends sequelize_1.Model {
    /**
     * Overrides the native serialization method. Express calls this implicitly
     * when executing `res.json(user)`. Ensures that the password hash is never sent over the network.
     */
    toJSON() {
        const attributes = { ...this.get() };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete attributes.passwordHash;
        return attributes;
    }
}
exports.User = User;
/**
 * 4. Initialization of the Model and Physical Schema
 */
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "The email address provided is invalid.",
            },
        },
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    roleId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["email"] }],
});
exports.default = User;
