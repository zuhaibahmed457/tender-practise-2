import { ConfigService } from '@nestjs/config';
export declare class UrlService {
    private readonly configService;
    constructor(configService: ConfigService);
    createUrl(path: string): string;
}
