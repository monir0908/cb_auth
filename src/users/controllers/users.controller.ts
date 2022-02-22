import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserUpdateDto } from '../dtos/users.dto';
import { UserService } from '../services/users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('v1.0/users')
export class UsersController {
  constructor(private readonly userSvc: UserService) {}

  @Get()
  async getInfo(@Req() req: any): Promise<any> {
    return {
      ...(await this.userSvc.getUserInfo(req.user.username)),
      statusCode: HttpStatus.OK,
    };
  }

  @Put()
  async updateIno(
    @Body() userUpdateDto: UserUpdateDto,
    @Req() req: any,
  ): Promise<any> {
    return {
      ...(await this.userSvc.updateUser(req.user.username, userUpdateDto)),
      statusCode: HttpStatus.OK,
    };
  }

  @Delete('logout')
  async logoutUser(@Req() req: any): Promise<any> {
    return {
      ...(await this.userSvc.logout(req.user.username)),
      statusCode: HttpStatus.OK,
    };
  }
}
