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
var RealTimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeGateway = exports.EventType = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const dayjs = require("dayjs");
const socket_io_1 = require("socket.io");
const login_attempt_entity_1 = require("../../modules/auth/entities/login-attempt.entity");
const user_entity_1 = require("../../modules/users/entities/user.entity");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
var EventType;
(function (EventType) {
    EventType["NOTIFICATION"] = "notification";
    EventType["MESSAGE"] = "message";
})(EventType || (exports.EventType = EventType = {}));
let RealTimeGateway = RealTimeGateway_1 = class RealTimeGateway {
    constructor(loginAttemptsRepository, usersRepository) {
        this.loginAttemptsRepository = loginAttemptsRepository;
        this.usersRepository = usersRepository;
        this.logger = new common_2.Logger(RealTimeGateway_1.name);
        this.usersSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const { access_token } = client.handshake.auth;
            if (!access_token || typeof access_token !== 'string') {
                throw new common_1.UnauthorizedException('Access token is required');
            }
            const loginAttempt = await this.loginAttemptsRepository.findOne({
                where: {
                    access_token: access_token,
                    logout_at: (0, typeorm_2.IsNull)(),
                    expire_at: (0, typeorm_2.MoreThan)(new Date()),
                },
                relations: {
                    user: true,
                },
            });
            if (!loginAttempt) {
                throw new common_1.UnauthorizedException('Unauthorized connection attempt: Invalid session');
            }
            const user = await this.usersRepository.findOne({
                where: {
                    id: loginAttempt.user.id,
                    deleted_at: (0, typeorm_2.IsNull)(),
                    status: user_entity_1.UserStatus.ACTIVE,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User does not exist or is inactive');
            }
            loginAttempt.expire_at = dayjs().add(1, 'month').toDate();
            await this.loginAttemptsRepository.save(loginAttempt);
            if (!this.usersSockets.has(user.id)) {
                this.usersSockets.set(user.id, new Set());
            }
            this.usersSockets.get(user.id).add(client.id);
            console.log(`✅ User ${user.id} connected to WebSocket`);
        }
        catch (error) {
            this.logger.error(`🔥 Error in WebSocket authentication: ${error.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        try {
            for (const [userId, socketSet] of this.usersSockets) {
                if (socketSet.has(client.id)) {
                    socketSet.delete(client.id);
                    console.log(`🔴 User ${userId} disconnected from socket ${client.id}`);
                    if (socketSet.size === 0) {
                        this.usersSockets.delete(userId);
                    }
                    break;
                }
            }
        }
        catch (error) {
            this.logger.error(`🔥 Error in disconnect handling: ${error.message}`);
        }
    }
    sendEventToUser(userId, eventType, payload) {
        const socketIds = this.usersSockets.get(userId);
        if (!socketIds || socketIds.size === 0) {
            this.logger.warn(`⚠️  No active sessions for user ${userId}, skipping notification.`);
            return;
        }
        if (socketIds) {
            this.server.to([...socketIds]).emit(eventType, payload);
        }
    }
    handleMessage(messageData) {
        this.sendEventToUser(messageData.receiverId, EventType.MESSAGE, messageData);
    }
};
exports.RealTimeGateway = RealTimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealTimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(EventType.MESSAGE),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealTimeGateway.prototype, "handleMessage", null);
exports.RealTimeGateway = RealTimeGateway = RealTimeGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/real-time', cors: true }),
    __param(0, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RealTimeGateway);
//# sourceMappingURL=real-time.gateway.js.map