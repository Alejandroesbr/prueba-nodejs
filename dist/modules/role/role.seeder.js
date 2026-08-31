"use strict";
// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/role/role.seeder.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRoles = void 0;
const role_model_1 = __importDefault(require("./role.model"));
const seedRoles = async () => {
    try {
        // 1. Admin
        await role_model_1.default.findOrCreate({
            where: { name: "ADMIN" },
            defaults: {
                name: "ADMIN",
                description: "Infrastructure Administrator",
            },
        });
        // 2. Request manager
        await role_model_1.default.findOrCreate({
            where: { name: "REQUEST_MANAGER" },
            defaults: {
                name: "REQUEST_MANAGER",
                description: "Manages medication supply requests",
            },
        });
        console.log("[Seeders]: The ‘ADMIN’ and ‘REQUEST_MANAGER’ roles have been successfully validated/created.");
    }
    catch (error) {
        console.error("[Seeders Error]: Error occurred while attempting to initialize the roles.", error);
        throw error;
    }
};
exports.seedRoles = seedRoles;
