import { Injectable } from '@nestjs/common';
import { IHealthCheck } from './interfaces/base.interface';

@Injectable()
export class AppService {
  getHello(request_method: string): IHealthCheck {
    return {
      message: 'Captain Banik Auth Service',
      method: request_method,
    };
  }
}
