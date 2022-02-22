import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request } from 'express';

@Injectable()
export class SecretKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['secret-key']) {
      if (req.headers['secret-key'] != this.configService.get('secret_key')) {
        throw new UnauthorizedException({
          success: false,
          message: 'secret key missing',
        });
      }
      next();
    } else {
      throw new UnauthorizedException({
        success: false,
        message: 'secret key missing',
      });
    }
  }
}
