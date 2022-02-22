import {
  IAccessToken,
  IAccessTokenObj,
  IRefreshToken,
  IRefreshTokenObj,
} from '../schemas/definitions/users.interface';

export function extractTokenObj(data: IAccessToken): IAccessTokenObj {
  return {
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    is_staff: data.is_staff,
    is_superuser: data.is_superuser,
  };
}

export function extractRefreshTokenObj(data: IRefreshToken): IRefreshTokenObj {
  return {
    username: data.username,
  };
}
