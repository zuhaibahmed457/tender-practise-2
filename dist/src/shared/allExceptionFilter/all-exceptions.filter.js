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
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const logger_service_1 = require("../../modules/logger/logger.service");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(httpAdapterHost, configService, loggerService) {
        this.httpAdapterHost = httpAdapterHost;
        this.configService = configService;
        this.loggerService = loggerService;
    }
    async catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = this.getHttpStatus(exception);
        if (httpStatus !== 422) {
            await this.loggerService.logException(exception, httpStatus, host);
        }
        const responseBody = this.prepareResponse(exception, httpStatus);
        console.log("🚀 ~ AllExceptionsFilter ~ responseBody:", responseBody);
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
    getHttpStatus(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
    prepareResponse(exception, httpStatus) {
        const errorStack = exception instanceof Error && exception.stack;
        const error = exception instanceof common_1.HttpException ? exception.name : "Error";
        const message = exception instanceof common_1.HttpException ? exception.message : "Internal server error";
        const details = exception instanceof common_1.UnprocessableEntityException ? exception.getResponse() : undefined;
        return {
            statusCode: httpStatus,
            error,
            message,
            errorStack: this.configService.get("nodeEnv") === "production" ? undefined : errorStack,
            details,
        };
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost,
        config_1.ConfigService,
        logger_service_1.LoggerService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map