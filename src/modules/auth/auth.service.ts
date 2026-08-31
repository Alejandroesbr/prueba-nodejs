// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/auth/auth.service.ts

import { BadRequestError, UnauthorizedError } from "../../core/errors/custom.error";
import { comparePassword, hashPassword } from "../../core/utils/hash.util";
import { generateToken } from "../../core/utils/jwt.util";
import Role from "../role/role.model";
import User from "../user/user.model";
import { UserRoleName } from "./auth.dto";

interface LoginInput {
    email: string;
    password: string;
}
interface RegisterInput {
    email: string;
    password: string;
    roleName: UserRoleName;
}

export class AuthService {
    /**
     * Registers a new user by dynamically associating them with the requested role.
     */
    public async register(data: RegisterInput) {
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new BadRequestError("The email address is already registered..");
        }

        const requestedRole = await Role.findOne({ where: { name: data.roleName } });
        if (!requestedRole) {
            throw new BadRequestError(
                `The requested role "${data.roleName}" does not exist in the database. Run the seeder first.`,
            );
        }

        const hashedPassword = await hashPassword(data.password);

        const newUser = await User.create({
            email: data.email,
            passwordHash: hashedPassword,
            roleId: requestedRole.id,
        });

        return newUser;
    }

    /**
     * Authenticates credentials and issues a signed JWT for the user.
     */
    public async login(data: LoginInput) {
        const user = await User.findOne({
            where: { email: data.email },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["name"],
                },
            ],
        });
        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isMatch = await comparePassword(data.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const roleEntity = user.get("role") as Role | null;
        const roleName = roleEntity?.name as UserRoleName;

        const token = generateToken({
            userId: user.id,
            roleName: roleName,
        });

        return { user, token };
    }
}

export const authService = new AuthService();
