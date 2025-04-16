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
exports.Media = exports.MediaType = void 0;
const message_entity_1 = require("../../chat/entities/message.entity");
const tender_entity_1 = require("../../tender/entities/tender.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
    MediaType["PDF"] = "pdf";
})(MediaType || (exports.MediaType = MediaType = {}));
let Media = class Media extends typeorm_1.BaseEntity {
};
exports.Media = Media;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Media.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MediaType,
    }),
    __metadata("design:type", String)
], Media.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Media.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tender_entity_1.Tender, (tender) => tender.medias, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'tender_id' }),
    __metadata("design:type", tender_entity_1.Tender)
], Media.prototype, "tender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Media.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => message_entity_1.Message),
    (0, typeorm_1.JoinColumn)({ name: 'message_id' }),
    __metadata("design:type", message_entity_1.Message)
], Media.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Media.prototype, "created_at", void 0);
exports.Media = Media = __decorate([
    (0, typeorm_1.Entity)()
], Media);
//# sourceMappingURL=media.entity.js.map