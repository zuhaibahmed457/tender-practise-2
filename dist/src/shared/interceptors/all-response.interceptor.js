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
exports.AllResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logger_service_1 = require("../../modules/logger/logger.service");
const perf_hooks_1 = require("perf_hooks");
let AllResponseInterceptor = class AllResponseInterceptor {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const start = perf_hooks_1.performance.now();
        return next.handle().pipe((0, rxjs_1.map)(async (data) => {
            const duration = (perf_hooks_1.performance.now() - start).toFixed(2);
            const httpStatus = context.switchToHttp().getResponse()?.statusCode || 200;
            await this.loggerService.logResponseDetails(request, duration, data, httpStatus);
            const formattedResponse = {
                status: httpStatus,
                message: data?.message || 'Success',
                ...((data?.details || data?.extra) && {
                    response: {
                        ...(data.details && { details: data.details }),
                        ...(data.extra && { extra: data.extra }),
                    },
                }),
            };
            return formattedResponse;
        }));
    }
};
exports.AllResponseInterceptor = AllResponseInterceptor;
exports.AllResponseInterceptor = AllResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], AllResponseInterceptor);
//# sourceMappingURL=all-response.interceptor.js.map