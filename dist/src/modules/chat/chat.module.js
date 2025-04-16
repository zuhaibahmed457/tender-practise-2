"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_gateway_1 = require("./chat.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const bid_entity_1 = require("../bid/entities/bid.entity");
const tender_entity_1 = require("../tender/entities/tender.entity");
const message_entity_1 = require("./entities/message.entity");
const chat_entity_1 = require("./entities/chat.entity");
const chat_participant_entity_1 = require("./entities/chat-participant.entity");
const chat_controller_1 = require("./chat.controller");
const message_service_1 = require("./message.service");
const media_module_1 = require("../media/media.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User, bid_entity_1.Bid, tender_entity_1.Tender, message_entity_1.Message, chat_entity_1.Chat, chat_participant_entity_1.ChatParticipant
            ]),
            media_module_1.MediaModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService, message_service_1.MessageService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map