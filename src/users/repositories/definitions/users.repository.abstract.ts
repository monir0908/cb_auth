import {
  IPagination,
  IUser,
  IUserInformation,
} from '../../schemas/definitions/users.interface';

export abstract class UsersRepository {
  abstract create_user(obj: IUser): Promise<IUser | null>;
  abstract get_user(username: string): Promise<IUser | null>;
  abstract get_user_with_email(
    username: string,
    email: string,
  ): Promise<IUser | null>;
  abstract update_user(obj: any, username: string): Promise<IUser | null>;
  abstract get_users(
    filters: IPagination,
    page: number,
    pageSize: number,
  ): Promise<any>;
  abstract count(querySpec: IPagination): Promise<number>;
}

export abstract class UserInfoRepository {
  abstract createInfo(obj: IUserInformation): Promise<IUserInformation | null>;
  abstract getInfo(username: string): Promise<IUserInformation | null>;
}
