"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformFeesModule = void 0;
const common_1 = require("@nestjs/common");
const platform_fees_service_1 = require("./platform-fees.service");
const platform_fees_controller_1 = require("./platform-fees.controller");
const typeorm_1 = require("@nestjs/typeorm");
const platform_fee_entity_1 = require("./entities/platform-fee.entity");
const shared_module_1 = require("../../shared/shared.module");
let PlatformFeesModule = class PlatformFeesModule {
};
exports.PlatformFeesModule = PlatformFeesModule;
exports.PlatformFeesModule = PlatformFeesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([platform_fee_entity_1.PlatformFee]), shared_module_1.SharedModule],
        controllers: [platform_fees_controller_1.PlatformFeesController],
        providers: [platform_fees_service_1.PlatformFeesService],
    })
], PlatformFeesModule);
//# sourceMappingURL=platform-fees.module.js.map