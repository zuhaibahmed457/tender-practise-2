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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const firebase = require("firebase-admin");
const firebase_1 = require("../firebase-credentials/firebase");
const typeorm_1 = require("@nestjs/typeorm");
const login_attempt_entity_1 = require("../../auth/entities/login-attempt.entity");
const typeorm_2 = require("typeorm");
let PushNotificationService = class PushNotificationService {
    constructor(loginAttemptRepository) {
        this.loginAttemptRepository = loginAttemptRepository;
        firebase.initializeApp({
            credential: firebase.credential.cert(JSON.parse(JSON.stringify(firebase_1.default))),
        });
    }
    async sendNotification(userNotification, payload) {
        const loginAttempt = await this.loginAttemptRepository
            .createQueryBuilder('login_attempt')
            .leftJoinAndSelect('login_attempt.user', 'user')
            .where('user.id = :user_id', { user_id: userNotification.user.id })
            .andWhere('login_attempt.expire_at > :currentDate', {
            currentDate: new Date(),
        })
            .andWhere('login_attempt.logout_at IS NULL')
            .distinctOn(["fcm_device_token"])
            .orderBy("fcm_device_token", "ASC")
            .getMany();
        const tokens = loginAttempt
            .map((attempts) => attempts.fcm_device_token)
            .filter(Boolean);
        if (tokens.length) {
            const payload = {
                tokens,
                webpush: {
                    data: {
                        title: userNotification.notification.title,
                        body: userNotification.notification.message,
                        entity_type: userNotification.notification.entity_type,
                        entity_id: userNotification.notification.entity_id,
                        user_role: userNotification.user.role
                    },
                },
            };
            try {
                const response = await firebase
                    .messaging()
                    .sendEachForMulticast(payload);
                const invalidTokens = [];
                response.responses.forEach((result, index) => {
                    if (!result.success) {
                        invalidTokens.push(tokens[index]);
                    }
                });
                if (invalidTokens.length > 0) {
                    await this.loginAttemptRepository
                        .createQueryBuilder()
                        .update(login_attempt_entity_1.LoginAttempt)
                        .set({ expire_at: new Date() })
                        .where('fcm_device_token IN (:...invalidTokens)', { invalidTokens })
                        .execute();
                }
            }
            catch (error) {
                console.error('Error sending notification:', error);
            }
        }
    }
};
exports.PushNotificationService = PushNotificationService;
exports.PushNotificationService = PushNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PushNotificationService);
//# sourceMappingURL=push-notification.service.js.map