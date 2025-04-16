import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost } from "@nestjs/core";
import { LoggerService } from "src/modules/logger/logger.service";
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly configService;
    private readonly loggerService;
    constructor(httpAdapterHost: HttpAdapterHost, configService: ConfigService, loggerService: LoggerService);
    catch(exception: unknown, host: ArgumentsHost): Promise<void>;
    private getHttpStatus;
    private prepareResponse;
}
