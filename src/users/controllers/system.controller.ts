import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from '../services/system.service';

@ApiBearerAuth()
@Controller('v1.0/system')
export class SystemController {
  constructor(private readonly systemSvc: SystemService) {}

  @Get('decode-token')
  async decodeToken(@Req() req: any): Promise<any> {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
      throw new UnauthorizedException({
        success: false,
        message: 'token is required',
      });
    }
    try {
      const token = bearerToken.split(' ')[1];
      const decodedData = await this.systemSvc.decodeAccessToken(token);
      req.user = decodedData;
      return {
        ...req.user,
      };
    } catch (err) {
      if (err.response && err.status >= 400 && err.status < 500)
        throw new UnauthorizedException(err.response);
      else throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
