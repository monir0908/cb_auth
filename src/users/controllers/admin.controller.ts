import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateAdminUserDto,
  PaginationDto,
  UserUpdateDto,
} from '../dtos/users.dto';
import { UserService } from '../services/users.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('v1.0/admin')
export class AdminController {
  constructor(private readonly userSvc: UserService) {}

  @Get('users')
  async getUsers(@Query() filters: PaginationDto): Promise<any> {
    return {
      ...(await this.userSvc.getUsers(filters)),
      statusCode: HttpStatus.OK,
    };
  }

  @Get('users/:username')
  @ApiParam({ name: 'username' })
  async getUser(@Param('username') username: string): Promise<any> {
    return {
      ...(await this.userSvc.getUserInfo(username)),
      statusCode: HttpStatus.OK,
    };
  }

  @Post('registration')
  async createAdmin(@Body() adminUserDto: CreateAdminUserDto): Promise<any> {
    return {
      ...(await this.userSvc.createAdminUser(adminUserDto)),
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete('logout')
  async logoutUser(@Req() req: any): Promise<any> {
    return {
      ...(await this.userSvc.logout(req.user.username)),
      statusCode: HttpStatus.OK,
    };
  }

  @Get('own-profile')
  async ownProfile(@Req() req: any): Promise<any> {
    return {
      ...(await this.userSvc.getUserInfo(req.user.username)),
      statusCode: HttpStatus.OK,
    };
  }

  @ApiParam({ name: 'username' })
  @Put('users/:username')
  async updateUser(
    @Param('username') username: string,
    @Body() updateDto: UserUpdateDto,
  ): Promise<any> {
    return {
      ...(await this.userSvc.updateUser(username, updateDto)),
      statusCode: HttpStatus.OK,
    };
  }
}
