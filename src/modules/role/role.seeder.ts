// /home/Coder/prueba-nodejs/api-riwimedicare/src/modules/role/role.seeder.ts

import Role from "./role.model";

export const seedRoles = async (): Promise<void> => {
    try {
        // 1. Admin
        await Role.findOrCreate({
            where: { name: "ADMIN" },
            defaults: {
                name: "ADMIN",
                description: "Infrastructure Administrator",
            },
        });

        // 2. User
        await Role.findOrCreate({
            where: { name: "USER" },
            defaults: {
                name: "USER",
                description: "Basic Customer Access",
            },
        });

        console.log("[Seeders]: The ‘ADMIN’ and ‘USER’ roles have been successfully validated/created.");
    } catch (error) {
        console.error("[Seeders Error]: Error occurred while attempting to initialize the roles.", error);
    }
};
