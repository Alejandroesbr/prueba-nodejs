"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const custom_error_1 = require("../../core/errors/custom.error");
const hash_util_1 = require("../../core/utils/hash.util");
const jwt_util_1 = require("../../core/utils/jwt.util");
const role_model_1 = __importDefault(require("../role/role.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
class AuthService {
    /**
     * Registers a new user by dynamically associating them with the requested role.
     */
    async register(data) {
        const existingUser = await user_model_1.default.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new custom_error_1.BadRequestError("The email address is already registered..");
        }
        const requestedRole = await role_model_1.default.findOne({ where: { name: data.roleName } });
        if (!requestedRole) {
            throw new custom_error_1.BadRequestError(`The requested role "${data.roleName}" does not exist in the database. Run the seeder first.`);
        }
        const hashedPassword = await (0, hash_util_1.hashPassword)(data.password);
        const newUser = await user_model_1.default.create({
            email: data.email,
            passwordHash: hashedPassword,
            roleId: requestedRole.dataValues.id,
        });
        return newUser;
    }
    /**
     * Authenticates credentials and issues a signed JWT for the user.
     */
    async login(data) {
        const user = await user_model_1.default.findOne({
            where: { email: data.email },
            include: [
                {
                    model: role_model_1.default,
                    as: "role",
                    attributes: ["name"],
                },
            ],
        });
        if (!user) {
            throw new custom_error_1.UnauthorizedError("Invalid credentials");
        }
        const isMatch = await (0, hash_util_1.comparePassword)(data.password, user.dataValues.passwordHash);
        if (!isMatch) {
            throw new custom_error_1.UnauthorizedError("Invalid credentials");
        }
        const roleEntity = user.get("role");
        const roleName = roleEntity ? roleEntity.name : "USER";
        const token = (0, jwt_util_1.generateToken)({
            userId: user.dataValues.id,
            roleName: roleName,
        });
        return { user, token };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
