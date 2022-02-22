import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { ProfileSyncCommandHandler } from './handlers/auth-profile-sync.handler';
import { UserSyncCommandHandler } from './handlers/auth-user-sync.handler';
import { SmsSendCommandHandler } from './handlers/sms-send.handler';
import { RMQAuthService } from './services/auth.command.service';
import { AuthQueueService } from './services/definitions/auth.command.abstract.service';

@Module({
  imports: [ConfigModule, CqrsModule, CommandBus],
  providers: [
    {
      provide: AuthQueueService,
      useClass: RMQAuthService,
    },
    SmsSendCommandHandler,
    UserSyncCommandHandler,
    ProfileSyncCommandHandler,
  ],
  exports: [AuthQueueService],
})
export class QueueModule {}
