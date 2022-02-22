import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserSyncCommand } from 'src/queues/commands/auth-user-sync.command';
import { SmsSendCommand } from '../../queues/commands/sms-send.command';
import {
  CreateAdminUserDto,
  CreateUserDto,
  PaginationDto,
  ResetPasswordDto,
  SendOtpDto,
  UserLoginDto,
  UserUpdateDto,
  UserVerifyDto,
} from '../dtos/users.dto';
import { UsersRedisRepository } from '../repositories/definitions/user.redis.repository.abstract';
import { UsersRepository } from '../repositories/definitions/users.repository.abstract';
import {
  IPagination,
  IUser,
  IUserUpdate,
} from '../schemas/definitions/users.interface';
import {
  checkPassword,
  checkUserActiveOrVerified,
  createAccessTokenObj,
  createAdminUserObj,
  createOtp,
  createRefreshTokenObj,
  createUserObj,
  generatePasswordHash,
  paginationData,
  updateUsername,
} from '../utils/users.utils';

@Injectable()
export class UserService {
  private appEnv: string;
  private accessTokenExp: number;
  private refreshTokenExp: number;

  constructor(
    private readonly userRepo: UsersRepository,
    private readonly confService: ConfigService,
    private readonly redisRepo: UsersRedisRepository,
    private readonly commandBus: CommandBus,
    private readonly jwtSvc: JwtService,
  ) {
    this.appEnv = this.confService.get('app_env');
    this.accessTokenExp = this.confService.get('access_token_exp');
    this.refreshTokenExp = this.confService.get('refresh_token_exp');
  }

  async createUser(obj: CreateUserDto): Promise<IUser | null> {
    const username = updateUsername(obj.username);
    const getUser = await this.userRepo.get_user_with_email(
      username,
      obj.email,
    );
    if (getUser !== null) {
      throw new ConflictException({
        success: false,
        message: 'user aleady exists',
      });
    }
    const userObj: IUser = createUserObj(obj, username);
    const user: IUser = await this.userRepo.create_user(userObj);
    const otp: number = createOtp(this.appEnv);
    await this.redisRepo.save(username + '_otp', otp, 'EX', 300);
    await this.commandBus.execute(
      new SmsSendCommand(username, `Your OTP is ${otp}`),
    );
    await this.commandBus.execute(new UserSyncCommand(user));
    delete user.password;
    return user;
  }

  async loginUser(obj: UserLoginDto): Promise<any> {
    const getUser = await this.userRepo.get_user(obj.username);
    if (!getUser) {
      throw new NotFoundException({
        success: false,
        message: 'user not found',
      });
    }
    checkUserActiveOrVerified(getUser);
    checkPassword(obj.password, getUser.password);
    const accessTokenObj = createAccessTokenObj(getUser, this.accessTokenExp);
    const refreshTokenObj = createRefreshTokenObj(
      getUser.username,
      this.refreshTokenExp,
    );
    const accessToken = this.jwtSvc.sign(accessTokenObj);
    const refreshToken = this.jwtSvc.sign(refreshTokenObj);
    await this.redisRepo.save(
      getUser.username + '_access_token',
      accessToken,
      'EX',
      this.accessTokenExp * 60 * 60,
    );
    return {
      accessToken,
      refreshToken,
      is_staff: getUser.is_staff,
    };
  }

  async verifyUser(obj: UserVerifyDto): Promise<any> {
    const getUser = await this.userRepo.get_user(obj.username);
    if (!getUser) {
      throw new NotFoundException({
        success: false,
        message: 'user not found',
      });
    }
    if (!getUser.is_active) {
      throw new BadRequestException({
        success: false,
        message: 'user is already active',
      });
    }
    if (getUser.is_verified) {
      throw new BadRequestException({
        success: false,
        message: 'user is already verified',
      });
    }
    const getOtp = await this.redisRepo.get(getUser.username + '_otp');
    if (getOtp !== obj.otp.toString()) {
      throw new BadRequestException({
        success: false,
        message: 'invalid otp provided',
      });
    }
    getUser.is_verified = true;
    const user = await this.userRepo.update_user(getUser, obj.username);
    await this.commandBus.execute(new UserSyncCommand(user));
    return { message: 'user is verified' };
  }

  async sendOtp(obj: SendOtpDto): Promise<any> {
    const getUser = await this.userRepo.get_user(obj.username);
    if (!getUser) {
      throw new NotFoundException({
        success: false,
        message: 'user not found',
      });
    }
    const otp = createOtp(this.appEnv);
    await this.redisRepo.save(obj.username + '_otp', otp, 'EX', 300);
    await this.commandBus.execute(
      new SmsSendCommand(obj.username, `Your OTP is ${otp}`),
    );
    return { message: 'otp has been sent successfully' };
  }

  async updatePassword(obj: ResetPasswordDto): Promise<any> {
    const getUser = await this.userRepo.get_user(obj.username);
    if (!getUser) {
      throw new NotFoundException({
        success: false,
        message: 'user not found',
      });
    }
    const getOtp = await this.redisRepo.get(getUser.username + '_otp');
    if (getOtp !== obj.otp.toString()) {
      throw new BadRequestException({
        success: false,
        message: 'invalid otp provided',
      });
    }
    const password = generatePasswordHash(obj.password);
    getUser.password = password;
    await this.userRepo.update_user(getUser, getUser.username);
    return { message: 'user password updated' };
  }

  async getUsers(filters: PaginationDto): Promise<any> {
    let offset = Number(filters.page) || 1;
    let limit = Number(filters.page_size) || 10;
    if (limit >= 20 || limit <= 0) limit = 10;
    if (offset <= 0) offset = 1;
    const skip = limit * (offset - 1);
    const querySpec: IPagination = { ...filters };

    const data = await this.userRepo.get_users(querySpec, skip, limit);
    const count = await this.userRepo.count(querySpec);
    return {
      meta_info: paginationData(count, limit, offset),
      data,
    };
  }

  async logout(username: string): Promise<any> {
    await this.redisRepo.delete(username + '_access_token');
    return {
      message: 'user is logged out',
    };
  }

  async createAdminUser(obj: CreateAdminUserDto): Promise<IUser | null> {
    const username = updateUsername(obj.username);
    const getUser = await this.userRepo.get_user(username);
    if (getUser !== null) {
      throw new ConflictException({
        success: false,
        message: 'user aleady exists',
      });
    }
    const userObj: IUser = createAdminUserObj(obj, username);
    const user: IUser = await this.userRepo.create_user(userObj);
    delete user.password;
    await this.commandBus.execute(new UserSyncCommand(user));
    return user;
  }

  async getUserInfo(username: string): Promise<IUser> {
    const user = await this.userRepo.get_user(username);
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'user not found',
      });
    }
    return user;
  }

  async updateUser(username: string, obj: UserUpdateDto): Promise<IUser> {
    const getUser = await this.userRepo.get_user(username);
    if (getUser !== null) {
      throw new NotFoundException({
        success: false,
        message: 'user not found',
      });
    }
    const updatObj: IUserUpdate = { ...obj };
    await this.redisRepo.delete(username + '_access_token');
    const user = await this.userRepo.update_user(updatObj, username);
    await this.commandBus.execute(new UserSyncCommand(user));
    return user;
  }
}
