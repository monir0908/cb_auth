import { ApproveStatusEnum } from 'src/users/enum/user.enum';

export class ProfileSyncCommand {
  constructor(
    public readonly username: string,
    public readonly companyName: string,
    public readonly approved: ApproveStatusEnum,
  ) {}
}
