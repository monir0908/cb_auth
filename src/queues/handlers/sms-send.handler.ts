import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SmsSendCommand } from '../commands/sms-send.command';
import {
  AuthEvents,
  AuthQueueService,
} from '../services/definitions/auth.command.abstract.service';

@CommandHandler(SmsSendCommand)
export class SmsSendCommandHandler implements ICommandHandler<SmsSendCommand> {
  constructor(public readonly authQueueSvc: AuthQueueService) {}

  async execute(command: SmsSendCommand): Promise<any> {
    if (this.authQueueSvc.isConnected()) {
      const { message, username } = command;
      await this.authQueueSvc.publishAuthEvents(
        AuthEvents.SEND_OTP,
        {
          message,
          username,
        },
        'direct',
      );
    }
  }
}
