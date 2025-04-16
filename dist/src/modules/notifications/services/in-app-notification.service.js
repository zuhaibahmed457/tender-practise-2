"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppNotificationService = void 0;
const common_1 = require("@nestjs/common");
const real_time_gateway_1 = require("../../../shared/gateway/real-time.gateway");
let InAppNotificationService = class InAppNotificationService {
    constructor(realTimeGateway) {
        this.realTimeGateway = realTimeGateway;
    }
    async sendNotification(userNotification, payload) {
        this.realTimeGateway.sendEventToUser(userNotification.user.id, real_time_gateway_1.EventType.NOTIFICATION, {
            id: userNotification.id,
            title: userNotification.notification.title,
            entity_type: userNotification.notification.entity_type,
            entity_id: userNotification.notification.entity_id,
            message: userNotification.notification.message,
            meta_data: payload,
        });
    }
};
exports.InAppNotificationService = InAppNotificationService;
exports.InAppNotificationService = InAppNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [real_time_gateway_1.RealTimeGateway])
], InAppNotificationService);
//# sourceMappingURL=in-app-notification.service.js.map