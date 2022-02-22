import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { pbkdf2Sync, randomInt } from 'crypto';
import { CreateAdminUserDto, CreateUserDto } from '../dtos/users.dto';
import {
  IAccessToken,
  IPagination,
  IRefreshToken,
  IUser,
} from '../schemas/definitions/users.interface';

export function updateUsername(username: string): string {
  if (username.startsWith('+88')) return username.replace('+', '');
  else if (username.startsWith('088')) return username.replace('088', '88');
  else return '88' + username;
}

export function generatePasswordHash(password: string): string {
  const salt = Buffer.from(password, 'utf-8');
  return pbkdf2Sync(password, salt, 100, 72, 'sha512').toString('base64');
}

export function createUserObj(obj: CreateUserDto, username: string): IUser {
  const password: string = generatePasswordHash(obj.password);
  return {
    username: username,
    first_name: obj.first_name,
    last_name: obj.last_name,
    email: obj.email,
    password: password,
    is_active: true,
    is_staff: false,
    is_superuser: false,
    is_verified: false,
  };
}

export function createAdminUserObj(
  obj: CreateAdminUserDto,
  username: string,
): IUser {
  const password: string = generatePasswordHash(obj.password);
  return {
    username: username,
    first_name: obj.first_name,
    last_name: obj.last_name,
    email: obj.username,
    password: password,
    is_active: true,
    is_staff: true,
    is_superuser: false,
    is_verified: false,
  };
}

export function createOtp(app_env: string): number {
  let otp = 99999;
  if (app_env === 'prod') {
    otp = randomInt(10000, 99999);
  }
  return otp;
}

export function checkUserActiveOrVerified(user: IUser): boolean {
  if (!user.is_active || !user.is_verified) {
    throw new UnprocessableEntityException({
      success: false,
      message: 'user is not active or verified',
    });
  }
  return true;
}

export function checkPassword(
  givenPassword: string,
  userPassword: string,
): boolean {
  console.log(givenPassword);
  const password = generatePasswordHash(givenPassword);
  console.log(password, userPassword);
  if (password !== userPassword) {
    throw new BadRequestException({
      success: false,
      message: 'incorrect password provided',
    });
  }
  return true;
}

export function createAccessTokenObj(
  user: IUser,
  tokenExp: number,
): IAccessToken {
  const exp = new Date();
  return {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    token_type: 'access',
    is_staff: user.is_staff,
    is_superuser: user.is_superuser,
    exp: exp.setHours(exp.getHours() + tokenExp),
  };
}

export function createRefreshTokenObj(
  username: string,
  refresh_token_expiry: number,
): IRefreshToken {
  const exp = new Date();
  return {
    username,
    exp: exp.setHours(exp.getHours() + refresh_token_expiry),
    token_type: 'refresh',
  };
}

export function paginationData(
  count: number,
  limit: number,
  offset: number,
): IPagination {
  const totalPages: number = Math.ceil(count / limit);
  let next = null;
  let previous = null;

  if (totalPages - (offset - 1) > 1) next = offset + 1;
  if (totalPages - offset >= 0 && offset > 1) previous = offset - 1;
  return {
    page_size: limit,
    count,
    page: offset,
    next,
    previous,
  };
}
