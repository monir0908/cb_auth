export class SmsSendCommand {
  constructor(
    public readonly username: string,
    public readonly message: string,
  ) {}
}
