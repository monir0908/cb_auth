import { IUser } from 'src/users/schemas/definitions/users.interface';

export class UserSyncCommand {
  constructor(public readonly user: IUser) {}
}
