"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_exception_formatter_1 = require("./utils/validation-exception-formatter");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
        logger: ['debug', 'error', 'verbose', 'warn', 'log'],
    });
    app.use('/api/v1/stripe-integration/platform-webhook', bodyParser.raw({ type: 'application/json' }));
    app.use('/api/v1/stripe-integration/connect-account-webhook', bodyParser.raw({ type: 'application/json' }));
    app.enableCors();
    app.useBodyParser('json', { limit: '50mb' });
    app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
    app.useStaticAssets('public');
    app.setGlobalPrefix('/api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        stopAtFirstError: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: validation_exception_formatter_1.validationExceptionFormatter,
    }));
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), {
        fallbackOnErrors: true,
    });
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map