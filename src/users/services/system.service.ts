import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../dtos/users.dto';
import { UsersRedisRepository } from '../repositories/definitions/user.redis.repository.abstract';
import { UsersRepository } from '../repositories/definitions/users.repository.abstract';
import { extractRefreshTokenObj, extractTokenObj } from '../utils/jwt.utils';
import {
  checkUserActiveOrVerified,
  createAccessTokenObj,
  createRefreshTokenObj,
} from '../utils/users.utils';

@Injectable()
export class SystemService {
  private secretKey: string;
  private accessTokenExp: number;
  private refreshTokenExp: number;

  constructor(
    private readonly jwtSvc: JwtService,
    private readonly confSvc: ConfigService,
    private readonly redisRepo: UsersRedisRepository,
    private readonly userRepo: UsersRepository,
  ) {
    this.secretKey = this.confSvc.get('secret_key');
    this.accessTokenExp = this.confSvc.get('access_token_exp');
    this.refreshTokenExp = this.confSvc.get('refresh_token_exp');
  }

  async decodeAccessToken(token: string): Promise<any> {
    try {
      const decodedData = await this.jwtSvc.verify(token, {
        secret: this.secretKey,
      });
      if (!decodedData) {
        throw new UnauthorizedException({
          success: false,
          message: 'token cannot be decoded',
        });
      }
      const data = extractTokenObj(decodedData);
      const redisData = await this.redisRepo.get(
        data.username + '_access_token',
      );
      if (!redisData) {
        throw new UnauthorizedException({
          success: false,
          message: 'invalid token from redis',
        });
      }
      return decodedData;
    } catch (e) {
      throw new UnauthorizedException({
        success: false,
        message: 'invalid access token',
      });
    }
  }

  async tokenRefresh(obj: RefreshTokenDto): Promise<any> {
    try {
      const decodedData = await this.jwtSvc.verify(obj.refresh_token, {
        secret: this.secretKey,
      });
      if (!decodedData) {
        throw new UnauthorizedException({
          success: false,
          message: 'token cannot be decoded',
        });
      }
      const data = extractRefreshTokenObj(decodedData);
      const getUser = await this.userRepo.get_user(data.username);
      if (!getUser) {
        throw new NotFoundException({
          success: false,
          message: 'user not found',
        });
      }
      checkUserActiveOrVerified(getUser);
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
        is_stuff: getUser.is_staff,
      };
    } catch (e) {
      throw new UnauthorizedException({
        success: false,
        message: 'invalid access token',
      });
    }
  }
}
