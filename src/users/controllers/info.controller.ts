import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import { CreateProfileDto } from '../dtos/users.dto';
import { InfoService } from '../services/info.service';

@Controller('v1.0/user-profile')
export class InfoController {
  constructor(private readonly infoSvc: InfoService) {}

  @Post()
  async createInfo(
    @Req() req: any,
    @Body() createDto: CreateProfileDto,
  ): Promise<any> {
    return {
      ...(await this.infoSvc.createInfo(createDto, req.user.username)),
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async getInfo(@Req() req: any): Promise<any> {
    return {
      ...(await this.infoSvc.getInfo(req.user.username)),
      statusCode: HttpStatus.OK,
    };
  }
}
