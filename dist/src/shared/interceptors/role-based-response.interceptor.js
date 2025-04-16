"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleBasedResponseSerializer = void 0;
const rxjs_1 = require("rxjs");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../../modules/users/entities/user.entity");
class RoleBasedResponseSerializer {
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            const request = context.switchToHttp().getRequest();
            const userRole = request.user?.role
                ? request.user.role
                : user_entity_1.UserRole.ORGANIZATION;
            const serializedData = (0, class_transformer_1.plainToClass)(this.dto, data?.details, {
                groups: [userRole],
                excludeExtraneousValues: true,
            });
            const formattedResponse = {
                message: data.message,
                details: serializedData,
                extra: data.extra,
            };
            return formattedResponse;
        }));
    }
}
exports.RoleBasedResponseSerializer = RoleBasedResponseSerializer;
//# sourceMappingURL=role-based-response.interceptor.js.map