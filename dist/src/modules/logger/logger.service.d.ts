import { ArgumentsHost } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logger } from './entities/logger.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
interface LogParams {
    message: string;
    duration?: string;
    meta?: Record<string, any>;
    context?: Record<string, any>;
}
export declare class LoggerService {
    private readonly loggerRepository;
    constructor(loggerRepository: Repository<Logger>);
    logException(exception: unknown, httpStatus: number, host: ArgumentsHost): Promise<void>;
    logResponseDetails(request: any, duration: string, data: IResponse, httpStatus: number): Promise<void>;
    logInfo(params: LogParams): Promise<void>;
    logError(params: LogParams): Promise<void>;
    private saveLog;
}
export {};
