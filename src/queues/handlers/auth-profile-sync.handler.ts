import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProfileSyncCommand } from '../commands/auth-profile-sync-command';
import {
  AuthEvents,
  AuthQueueService,
} from '../services/definitions/auth.command.abstract.service';

@CommandHandler(ProfileSyncCommand)
export class ProfileSyncCommandHandler
  implements ICommandHandler<ProfileSyncCommand>
{
  constructor(public readonly authQueueSvc: AuthQueueService) {}

  async execute(command: ProfileSyncCommand): Promise<any> {
    if (this.authQueueSvc.isConnected()) {
      await this.authQueueSvc.publishAuthEvents(
        AuthEvents.PROFILE_SYNC,
        {
          command,
        },
        'direct',
      );
    }
  }
}
