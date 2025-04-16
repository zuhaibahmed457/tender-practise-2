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
exports.Message = exports.MessageStatus = void 0;
const typeorm_1 = require("typeorm");
const chat_entity_1 = require("./chat.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const media_entity_1 = require("../../media/entities/media.entity");
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["SENT"] = "sent";
    MessageStatus["UNREAD"] = "unread";
    MessageStatus["READ"] = "read";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
let Message = class Message extends typeorm_1.BaseEntity {
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_1.Chat, (chat) => chat.messages, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'chat_id' }),
    __metadata("design:type", chat_entity_1.Chat)
], Message.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_entity_1.Media, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'media_id' }),
    __metadata("design:type", media_entity_1.Media)
], Message.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Message.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.UNREAD,
    }),
    __metadata("design:type", String)
], Message.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Message.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.id, { cascade: true }),
    (0, typeorm_1.JoinTable)({
        name: 'message_read_by',
        joinColumn: { name: 'message_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Message.prototype, "read_by", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)()
], Message);
//# sourceMappingURL=message.entity.js.map