import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'nestjs-redis';
import { QueueModule } from 'src/queues/queues.module';
import { UserModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configs/index.config';
import {
  AppLoggerInterceptor,
  ExceptionHandlerInterceptor,
  TransformerInterceptor,
} from './interceptors/index.interceptor';
import { JWTMiddleware } from './middlewares/jwt.middleware';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        secret: confService.get('secret_key'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) =>
        confService.get('mongo'),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (confService: ConfigService) => confService.get('redis'),
      inject: [ConfigService],
    }),
    QueueModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionHandlerInterceptor,
    },
    JWTStrategy,
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes('v1.0/admin');
    consumer.apply(JWTMiddleware).forRoutes('v1.0/users');
    consumer.apply(JWTMiddleware).forRoutes('v1.0/user-profile');
  }
}
