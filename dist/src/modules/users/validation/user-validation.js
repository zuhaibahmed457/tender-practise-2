"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = validateUser;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
function validateUser(id, currentUser, updateUserDto, user) {
    if ([user_entity_1.UserRole.ADMIN].includes(currentUser?.role)) {
        if (user?.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to update super admin's information");
        }
        if (user?.role === user_entity_1.UserRole.ADMIN && user?.id !== currentUser?.id) {
            throw new common_1.ForbiddenException("You are not allowed to update another admin's information");
        }
    }
    if (updateUserDto?.role === user_entity_1.UserRole.ADMIN &&
        currentUser?.role !== user_entity_1.UserRole.SUPER_ADMIN) {
        throw new common_1.ForbiddenException('You are not allowed to update the admin role.');
    }
    if ([user_entity_1.UserRole.TRANSPORTER, user_entity_1.UserRole.ORGANIZATION].includes(currentUser.role) &&
        user.id !== currentUser.id) {
        throw new common_1.ForbiddenException("You are not allowed to update another customer's information");
    }
    if (updateUserDto?.role) {
        if ([user_entity_1.UserRole.TRANSPORTER, user_entity_1.UserRole.ORGANIZATION].includes(currentUser.role) &&
            user.role !== updateUserDto?.role) {
            throw new common_1.ForbiddenException('You are not allowed to update another role');
        }
    }
    if ([user_entity_1.UserRole.TRANSPORTER, user_entity_1.UserRole.ORGANIZATION].includes(currentUser.role) &&
        updateUserDto?.password) {
        throw new common_1.BadRequestException('Please use /users/change-password route to change password');
    }
}
//# sourceMappingURL=user-validation.js.map