import { validationExceptionFormatter } from './utils/validation-exception-formatter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: ['debug', 'error', 'verbose', 'warn', 'log'],
  });

  // Set raw body parsing for Stripe webhooks
  app.use(
    '/api/v1/stripe-integration/platform-webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.use(
    '/api/v1/stripe-integration/connect-account-webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.enableCors();
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
  app.useStaticAssets('public');
  app.setGlobalPrefix('/api/v1');

  // The validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // ** OVERRIDE THE STATUS
      stopAtFirstError: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationExceptionFormatter,
    }),
  );

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
