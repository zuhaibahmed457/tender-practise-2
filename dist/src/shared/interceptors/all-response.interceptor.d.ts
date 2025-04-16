import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/modules/logger/logger.service';
export declare class AllResponseInterceptor implements NestInterceptor {
    private readonly loggerService;
    constructor(loggerService: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
