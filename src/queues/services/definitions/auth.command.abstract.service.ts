export enum AuthEvents {
  SEND_OTP = 'auth.events.send.sms',
  USER_SYNC = 'auth.events.user.sync',
  PROFILE_SYNC = 'auth.events.profile.sync',
}

export abstract class AuthQueueService {
  abstract isConnected(): boolean;
  abstract publishAuthEvents(_event: string, msg: any, exchange: string);
}
