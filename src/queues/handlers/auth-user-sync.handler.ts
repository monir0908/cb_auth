import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserSyncCommand } from '../commands/auth-user-sync.command';
import {
  AuthEvents,
  AuthQueueService,
} from '../services/definitions/auth.command.abstract.service';

@CommandHandler(UserSyncCommand)
export class UserSyncCommandHandler
  implements ICommandHandler<UserSyncCommand>
{
  constructor(public readonly authQueueSvc: AuthQueueService) {}

  async execute(command: UserSyncCommand): Promise<any> {
    const { user } = command;
    if (this.authQueueSvc.isConnected()) {
      await this.authQueueSvc.publishAuthEvents(
        AuthEvents.USER_SYNC,
        {
          user,
        },
        'fanout',
      );
    }
  }
}
