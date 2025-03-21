import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class AdminRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsMongoId({ each: true }) // Validate array of MongoDB ObjectIds
  @IsNotEmpty()
  roles: Types.ObjectId[];
}

export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class AdminForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class AdminVerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class AdminResendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class AdminResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}

export class AdminChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  adminId: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}
