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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const logger_entity_1 = require("./entities/logger.entity");
let LoggerService = class LoggerService {
    constructor(loggerRepository) {
        this.loggerRepository = loggerRepository;
    }
    async logException(exception, httpStatus, host) {
        const request = host.switchToHttp().getRequest();
        const contextData = {
            method: request.method,
            url: request.url,
            body: request.body,
            params: request.params,
            query: request.query,
            responseStatus: httpStatus,
            user: request.user && { id: request.user.id, role: request.user.role },
        };
        const metaData = {
            ip: request.ip,
            userAgent: request.headers['user-agent'],
            referer: request.headers['referer'],
            host: request.headers['host'],
            stackTrace: exception instanceof Error ? exception.stack : undefined,
        };
        await this.logError({
            message: `${exception instanceof Error ? exception.message : 'Unknown error'}`,
            context: contextData,
            meta: metaData,
        });
    }
    async logResponseDetails(request, duration, data, httpStatus) {
        const contextData = {
            method: request.method,
            url: request.url,
            body: request.body,
            params: request.params,
            query: request.query,
            responseStatus: httpStatus,
            user: request.user && { id: request.user.id, role: request.user.role },
        };
        const metaData = {
            ip: request.ip,
            userAgent: request.headers['user-agent'],
            referer: request.headers['referer'],
            host: request.headers['host'],
        };
        await this.logInfo({
            message: data?.message,
            context: contextData,
            duration,
            meta: metaData,
        });
    }
    async logInfo(params) {
        await this.saveLog(logger_entity_1.LogLevel.INFO, params);
    }
    async logError(params) {
        await this.saveLog(logger_entity_1.LogLevel.ERROR, params);
    }
    async saveLog(level, params) {
        const logEntry = this.loggerRepository.create({
            level,
            message: params.message,
            duration: params.duration,
            context: params.context,
            meta: params.meta,
        });
        await this.loggerRepository.save(logEntry);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(logger_entity_1.Logger)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LoggerService);
//# sourceMappingURL=logger.service.js.map