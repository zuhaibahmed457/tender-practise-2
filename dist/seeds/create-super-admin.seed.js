"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdmin = void 0;
const user_entity_1 = require("../src/modules/users/entities/user.entity");
const createSuperAdmin = async (AppDataSource) => {
    const userRepository = AppDataSource.getRepository(user_entity_1.User);
    const existingAdmin = await userRepository.findOne({
        where: { email: 'superadmin@example.com' },
    });
    if (existingAdmin) {
        console.log('Super admin already exists');
        return;
    }
    const adminPassword = '123123';
    const superAdmin = userRepository.create({
        first_name: 'Super',
        last_name: 'Admin',
        email: 'superadmin@example.com',
        password: adminPassword,
        role: user_entity_1.UserRole.SUPER_ADMIN,
    });
    await userRepository.save(superAdmin);
    console.log('Super admin created successfully.');
};
exports.createSuperAdmin = createSuperAdmin;
//# sourceMappingURL=create-super-admin.seed.js.map