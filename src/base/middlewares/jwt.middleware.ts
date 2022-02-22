import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { SystemService } from 'src/users/services/system.service';

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  private readonly secret_key: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly systemSvc: SystemService,
  ) {
    this.secret_key = this.configService.get('secret_key');
  }
  async use(request: Request, response: Response, next: NextFunction) {
    const bearerToken = request.headers['authorization'];
    if (!bearerToken) {
      throw new UnauthorizedException({
        success: false,
        message: 'token is required',
      });
    }
    try {
      const token = bearerToken.split(' ')[1];
      const decodedData = await this.systemSvc.decodeAccessToken(token);
      request.user = decodedData;
      next();
    } catch (err) {
      if (err.response && err.status >= 400 && err.status < 500)
        throw new UnauthorizedException(err.response);
      else throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
