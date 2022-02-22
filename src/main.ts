import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { AppModule } from './base/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  const confService = app.get(ConfigService);
  Sentry.init(confService.get('sentry'));
  if (confService.get('app_env') !== 'prod') {
    const options = new DocumentBuilder()
      .setTitle('Auth Service')
      .setDescription('Captain Banik Auth Service API')
      .setVersion('v1.0')
      .addTag('Auth')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    };
    SwaggerModule.setup('docs', app, document, customOptions);
  }
  Logger.log(`App is listening to ${confService.get('port')}`);
  await app.listen(confService.get('port'));
}
bootstrap();
