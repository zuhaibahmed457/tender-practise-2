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
exports.Chat = void 0;
const typeorm_1 = require("typeorm");
const bid_entity_1 = require("../../bid/entities/bid.entity");
const tender_entity_1 = require("../../tender/entities/tender.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const chat_participant_entity_1 = require("./chat-participant.entity");
const message_entity_1 = require("./message.entity");
let Chat = class Chat extends typeorm_1.BaseEntity {
};
exports.Chat = Chat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Chat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Chat.prototype, "group_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Chat.prototype, "group_icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Chat.prototype, "is_archived", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creator_id' }),
    __metadata("design:type", user_entity_1.User)
], Chat.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_participant_entity_1.ChatParticipant, (chatParticipant) => chatParticipant.chat),
    __metadata("design:type", Array)
], Chat.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.chat, {
        cascade: ['insert', 'remove', 'update'],
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Chat.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Number)
], Chat.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => message_entity_1.Message),
    (0, typeorm_1.JoinColumn)({ name: 'last_message_sent_id' }),
    __metadata("design:type", message_entity_1.Message)
], Chat.prototype, "last_message_sent", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Chat.prototype, "last_message_sent_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => bid_entity_1.Bid),
    (0, typeorm_1.JoinColumn)({ name: 'bid_id' }),
    __metadata("design:type", bid_entity_1.Bid)
], Chat.prototype, "bid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tender_entity_1.Tender, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tender_id' }),
    __metadata("design:type", tender_entity_1.Tender)
], Chat.prototype, "tender", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Chat.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Chat.prototype, "archived_at", void 0);
exports.Chat = Chat = __decorate([
    (0, typeorm_1.Entity)()
], Chat);
//# sourceMappingURL=chat.entity.js.map