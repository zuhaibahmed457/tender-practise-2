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
exports.TenderController = void 0;
const common_1 = require("@nestjs/common");
const tender_service_1 = require("./tender.service");
const create_tender_dto_1 = require("./dto/create-tender.dto");
const update_tender_dto_1 = require("./dto/update-tender.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/guards/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const get_all_tenders_dto_1 = require("./dto/get-all-tenders.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const create_attachment_dto_1 = require("./dto/create-attachment.dto");
const manage_status_dto_1 = require("./dto/manage-status.dto");
let TenderController = class TenderController {
    constructor(tenderService) {
        this.tenderService = tenderService;
    }
    async create(currentUser, createTenderDto) {
        const tender = await this.tenderService.create(currentUser, createTenderDto);
        return {
            message: 'Tender created successfully',
            details: tender,
        };
    }
    async findAll(currentUser, getAllTendersDto) {
        const { items, meta } = await this.tenderService.findAll(currentUser, getAllTendersDto);
        return {
            message: 'Tenders fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findBidWithNonCreatedStatus(currentUser, paramIdDto) {
        const bidWithNonCreatedStatus = await this.tenderService.findBidWithNonCreatedStatus(currentUser, paramIdDto);
        return {
            message: 'Bid with non-created status fetched successfully',
            details: bidWithNonCreatedStatus,
        };
    }
    async manageStatus(currentUser, manageStatusDto, paramIdDto) {
        const tender = await this.tenderService.manageStatus(currentUser, paramIdDto, manageStatusDto);
        return {
            message: `Tender status changed to ${manageStatusDto.tender_status}`,
            tender: tender,
        };
    }
    async findOne(currentUser, paramIdDto) {
        const tender = await this.tenderService.findOne(currentUser, paramIdDto);
        return {
            message: 'Tender fetched successfully',
            details: tender,
        };
    }
    async update(currentUser, paramIdDto, updateTenderDto) {
        const updatedTender = await this.tenderService.update(paramIdDto, currentUser, updateTenderDto);
        return {
            message: 'Tender updated successfully',
            details: updatedTender,
        };
    }
    async createAttachment(currentUser, tender_id, createAttachmentDto) {
        const attachment = await this.tenderService.createAttachment(currentUser, tender_id, createAttachmentDto);
        return {
            message: 'File uploaded successfully',
            details: attachment,
        };
    }
    async deleteAttachment(currentUser, tender_id, attachment_id) {
        await this.tenderService.deleteAttachment(currentUser, tender_id, attachment_id);
        return {
            message: 'Tender deleted successfully',
        };
    }
    remove(id) {
        return this.tenderService.remove(+id);
    }
};
exports.TenderController = TenderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_tender_dto_1.CreateTenderDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_all_tenders_dto_1.GetAllTendersDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/bid-with-non-created-status'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "findBidWithNonCreatedStatus", null);
__decorate([
    (0, common_1.Patch)(':id/manage-status'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        manage_status_dto_1.ManageStatusDto,
        paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "manageStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto,
        update_tender_dto_1.UpdateTenderDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':tender_id/attachment'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tender_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, create_attachment_dto_1.CreateAttachmentDto]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "createAttachment", null);
__decorate([
    (0, common_1.Delete)(':tender_id/attachment/:attachment_id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tender_id')),
    __param(2, (0, common_1.Param)('attachment_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], TenderController.prototype, "deleteAttachment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenderController.prototype, "remove", null);
exports.TenderController = TenderController = __decorate([
    (0, common_1.Controller)('tender'),
    __metadata("design:paramtypes", [tender_service_1.TenderService])
], TenderController);
//# sourceMappingURL=tender.controller.js.map