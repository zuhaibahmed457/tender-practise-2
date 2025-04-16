"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizesModule = void 0;
const common_1 = require("@nestjs/common");
const sizes_service_1 = require("./sizes.service");
const sizes_controller_1 = require("./sizes.controller");
const typeorm_1 = require("@nestjs/typeorm");
const size_entity_1 = require("./entities/size.entity");
let SizesModule = class SizesModule {
};
exports.SizesModule = SizesModule;
exports.SizesModule = SizesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([size_entity_1.Size])],
        controllers: [sizes_controller_1.SizesController],
        providers: [sizes_service_1.SizesService],
    })
], SizesModule);
//# sourceMappingURL=sizes.module.js.map