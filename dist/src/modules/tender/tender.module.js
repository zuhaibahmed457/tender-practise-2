"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderModule = void 0;
const common_1 = require("@nestjs/common");
const tender_service_1 = require("./tender.service");
const tender_controller_1 = require("./tender.controller");
const typeorm_1 = require("@nestjs/typeorm");
const media_entity_1 = require("../media/entities/media.entity");
const tender_entity_1 = require("./entities/tender.entity");
const address_entity_1 = require("../address/entities/address.entity");
const industry_entity_1 = require("../industry/entities/industry.entity");
const size_entity_1 = require("../sizes/entities/size.entity");
const media_module_1 = require("../media/media.module");
const bid_entity_1 = require("../bid/entities/bid.entity");
const earnings_module_1 = require("../earnings/earnings.module");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const earning_entity_1 = require("../earnings/entities/earning.entity");
let TenderModule = class TenderModule {
};
exports.TenderModule = TenderModule;
exports.TenderModule = TenderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tender_entity_1.Tender,
                media_entity_1.Media,
                address_entity_1.Address,
                industry_entity_1.Industry,
                size_entity_1.Size,
                bid_entity_1.Bid,
                transaction_entity_1.Transaction,
                earning_entity_1.Earning,
            ]),
            media_module_1.MediaModule,
            earnings_module_1.EarningsModule,
        ],
        controllers: [tender_controller_1.TenderController],
        providers: [tender_service_1.TenderService],
        exports: [tender_service_1.TenderService],
    })
], TenderModule);
//# sourceMappingURL=tender.module.js.map