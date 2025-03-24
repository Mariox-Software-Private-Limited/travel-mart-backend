import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class ContactDetailsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}

export class UserRegisterDto {
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

  @IsMongoId({ each: true })
  @IsNotEmpty()
  roles: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  agencyName: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  natureOfBusiness: string;

  @IsString()
  @IsNotEmpty()
  businessType: string;

  @IsString()
  @IsNotEmpty()
  preferredCurrency: string;

  @IsOptional()
  @IsString()
  howDidYouHear?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsString()
  @IsNotEmpty()
  timeZone: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['Approved', 'Not Approved'])
  IATAStatus: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ContactDetailsDto)
  @IsNotEmpty()
  accounts: ContactDetailsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDetailsDto)
  reservationOperations?: ContactDetailsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDetailsDto)
  management?: ContactDetailsDto;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class UserForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserVerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class UserResendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UserResetPasswordDto {
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

export class UserChangePasswordDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;
}

export class UserEditProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
