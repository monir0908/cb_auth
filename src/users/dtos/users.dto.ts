import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsString({
    message: 'username must be a string',
    always: true,
  })
  @MaxLength(11)
  @MinLength(11)
  @IsMobilePhone()
  @IsDefined()
  username: string;

  @ApiProperty({ required: true })
  @IsString({
    message: 'password must be string',
    always: true,
  })
  @IsDefined()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString({
    message: 'first name must be string',
    always: true,
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString({
    message: 'last name must be string',
    always: true,
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  profile_pic_url?: string;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsDefined()
  @IsEmail()
  @IsString({
    message: 'email must be string',
    always: true,
  })
  @IsNotEmpty()
  email: string;
}

export class CreateProfileDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsString({
    message: 'company name must be a string',
    always: true,
  })
  @IsDefined()
  company_name: string;

  @ApiProperty({ required: true, uniqueItems: true })
  @IsString({
    message: 'address must be a string',
    always: true,
  })
  @IsDefined()
  address: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'bin must be a string',
    always: true,
  })
  @IsOptional()
  @IsUrl()
  bin?: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'bin_no must be a string',
    always: true,
  })
  @IsOptional()
  bin_no?: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'tin must be a string',
    always: true,
  })
  @IsOptional()
  @IsUrl()
  tin?: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'tin_no must be a string',
    always: true,
  })
  @IsOptional()
  tin_no?: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'trade_licence must be a string',
    always: true,
  })
  @IsOptional()
  @IsUrl()
  trade_licence?: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'trade_licence_no must be a string',
    always: true,
  })
  @IsOptional()
  trade_licence_no?: string;
}

export class UserUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({
    message: 'first name must be string',
    always: true,
  })
  first_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({
    message: 'last name must be string',
    always: true,
  })
  last_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  profile_pic_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({
    message: 'is_active must be boolean',
    always: true,
  })
  is_active?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UserLoginDto {
  @ApiProperty({ required: true })
  @IsString({
    message: 'username must be string',
    always: true,
  })
  @IsDefined()
  @Length(13)
  @IsMobilePhone()
  username: string;

  @ApiProperty({ required: true })
  @IsString({
    message: 'password must be string',
    always: true,
  })
  @IsDefined()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

export class UserVerifyDto {
  @ApiProperty({ required: true })
  @IsString({
    message: 'user name must be string',
    always: true,
  })
  @IsDefined()
  @Length(13)
  username: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsDefined()
  otp: number;
}

export class SendOtpDto {
  @ApiProperty({ required: true })
  @IsString({
    message: 'username must be string',
    always: true,
  })
  @IsDefined()
  @Length(13)
  username: string;
}

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsString({
    message: 'username must be string',
    always: true,
  })
  @IsDefined()
  @Length(13)
  username: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsDefined()
  otp: number;

  @ApiProperty({ required: true })
  @IsString({
    message: 'password must be string',
    always: true,
  })
  @IsDefined()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsString({
    message: 'username must be a string',
  })
  @IsMobilePhone()
  @IsOptional()
  @Length(13)
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({
    message: 'first name must be string',
  })
  first_name?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsString({
    message: 'email must be string',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString({
    message: 'is_active must be a string',
  })
  @IsMobilePhone()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  page_size?: number;
}

export class CreateAdminUserDto {
  @ApiProperty({ required: true, uniqueItems: true })
  @IsString({
    message: 'username must be a string',
    always: true,
  })
  @IsEmail()
  @IsMobilePhone()
  @IsDefined()
  @Length(13)
  username: string;

  @ApiProperty({ required: true })
  @IsString({
    message: 'password must be string',
    always: true,
  })
  @IsDefined()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString({
    message: 'first name must be string',
    always: true,
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsString({
    message: 'last name must be string',
    always: true,
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  profile_pic_url: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  is_staff: boolean;
}

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsString({
    message: 'refresh token must be string',
    always: true,
  })
  @IsDefined()
  @IsNotEmpty()
  refresh_token: string;
}
