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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const chat_service_1 = require("./chat.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_decorator_1 = require("../../shared/guards/roles.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const get_all_chat_dto_1 = require("./dto/get-all-chat.dto");
const create_message_dto_1 = require("./dto/create-message.dto");
const message_service_1 = require("./message.service");
let ChatController = class ChatController {
    constructor(chatService, messageService, events) {
        this.chatService = chatService;
        this.messageService = messageService;
        this.events = events;
    }
    async createBid(createChatDto, CurrentUser) {
        const chat = await this.chatService.create(createChatDto, CurrentUser);
        return {
            message: 'Chat created successfully',
            details: chat
        };
    }
    async getAllMessage(any, currentUser) {
        const { items, meta } = await this.messageService.getAllMessage(any, currentUser);
        return {
            message: `Messages fetched successfully`,
            details: items,
            extra: meta
        };
    }
    async findByBidId(paramIdDto, CurrentUser) {
        const chat = await this.chatService.findByBidId(CurrentUser, paramIdDto);
        return {
            message: 'Chat found successfully',
            details: chat
        };
    }
    async findOne(paramIdDto, CurrentUser) {
        const chat = await this.chatService.findOne(CurrentUser, paramIdDto);
        return {
            message: 'Chat found successfully',
            details: chat
        };
    }
    async findAll(getAllChatsDto, CurrentUser) {
        const chats = await this.chatService.findAll(CurrentUser, getAllChatsDto);
        return {
            message: 'Chats found successfully',
            details: chats,
        };
    }
    async sendMessage(createMessageData, currentUser) {
        const message = await this.messageService.createMessage(createMessageData, currentUser);
        return {
            message: 'Message send successfully',
            details: message,
        };
    }
    async markAllMessageRead(paramIdDto, currentUser) {
        await this.messageService.markAllMessageRead(paramIdDto, currentUser);
        return {
            message: 'All message marked as read successfully',
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createBid", null);
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllMessage", null);
__decorate([
    (0, common_1.Get)("/bid/:id"),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findByBidId", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_chat_dto_1.GetAllChatsDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('send-message'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Patch)(":id/mark-all-message-read"),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAllMessageRead", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        message_service_1.MessageService,
        event_emitter_1.EventEmitter2])
], ChatController);
//# sourceMappingURL=chat.controller.js.map