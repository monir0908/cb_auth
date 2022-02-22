import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './controllers/admin.controller';
import { InfoController } from './controllers/info.controller';
import { PublicController } from './controllers/publc.contoller';
import { SystemController } from './controllers/system.controller';
import { UsersController } from './controllers/users.controller';
import { UsersRedisRepository } from './repositories/definitions/user.redis.repository.abstract';
import {
  UserInfoRepository,
  UsersRepository,
} from './repositories/definitions/users.repository.abstract';
import { UserInfoObjRepository } from './repositories/user-info.repository';
import { UsersObjRedisRepository } from './repositories/users.redis.repository';
import { UsersObjRepository } from './repositories/users.repository';
import {
  UserInformation,
  UserInformationSchema,
} from './schemas/users-info.schema';
import { Users, UserSchema } from './schemas/users.schema';
import { InfoService } from './services/info.service';
import { SystemService } from './services/system.service';
import { UserService } from './services/users.service';

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: UserInformation.name,
        schema: UserInformationSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        secret: confService.get('secret_key'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AdminController,
    PublicController,
    UsersController,
    SystemController,
    InfoController,
  ],
  providers: [
    UserService,
    SystemService,
    InfoService,
    {
      provide: UsersRepository,
      useClass: UsersObjRepository,
    },
    {
      provide: UsersRedisRepository,
      useClass: UsersObjRedisRepository,
    },
    {
      provide: UserInfoRepository,
      useClass: UserInfoObjRepository,
    },
  ],
  exports: [SystemService],
})
export class UserModule {}
