import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  ResetPasswordDto,
  SendOtpDto,
  UserLoginDto,
  UserVerifyDto,
} from '../dtos/users.dto';
import { UserService } from '../services/users.service';

@ApiTags('Public')
@Controller('v1.0/public')
export class PublicController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async createUser(@Body() userDto: CreateUserDto): Promise<any> {
    return {
      ...(await this.userService.createUser(userDto)),
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post('login')
  async userLogin(@Body() loginDto: UserLoginDto): Promise<any> {
    return {
      ...(await this.userService.loginUser(loginDto)),
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post('verify')
  async verifyUser(@Body() verifyDto: UserVerifyDto): Promise<any> {
    return {
      ...(await this.userService.verifyUser(verifyDto)),
      statusCode: HttpStatus.OK,
    };
  }

  @Post('send-otp')
  async optSend(@Body() otpDto: SendOtpDto): Promise<any> {
    return {
      ...(await this.userService.sendOtp(otpDto)),
      statusCode: HttpStatus.CREATED,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPassDto: ResetPasswordDto): Promise<any> {
    return {
      ...(await this.userService.updatePassword(resetPassDto)),
      statusCode: HttpStatus.OK,
    };
  }
}
