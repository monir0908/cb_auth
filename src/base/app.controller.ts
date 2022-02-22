import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import { IHealthCheck } from './interfaces/base.interface';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHello(@Req() req: Request): IHealthCheck {
    return this.appService.getHello(req.method);
  }
}
