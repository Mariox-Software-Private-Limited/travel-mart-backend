import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Get,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterDto,
  UserLoginDto,
  UserForgotPasswordDto,
  //   UserVerifyOtpDto,
  UserResendOtpDto,
  UserResetPasswordDto,
  UserChangePasswordDto,
} from './dto/user.dto';
import { Response } from 'express';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { USER_LOGIN } from 'src/common/constants/response.constant';
import { UserJwtAuthGuard } from 'src/common/guards/user-jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { UserEditProfileDto } from './dto/user-edit-profile.dto';

@UseGuards(UserJwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() userDto: UserRegisterDto, @Res() res: Response) {
    return this.authService.register(userDto, res);
  }

  @Public()
  @ResponseMessage(USER_LOGIN)
  @Post('login')
  login(@Body() loginDto: UserLoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: UserForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  //   @Public()
  //   @Post('verify-otp')
  //   verifyOtp(@Body() verifyOtpDto: UserVerifyOtpDto) {
  //     return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  //   }

  @Public()
  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: UserResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: UserResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.newPassword,
    );
  }

  @Patch('change-password/:id')
  changePassword(
    @Param('id') userId: string,
    @Body() changePasswordDto: UserChangePasswordDto,
  ) {
    return this.authService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('profile')
  async getUserDetail(@Request() req, @Res() res: Response) {
    return this.authService.getUserDetail(req.user, res);
  }

  @Put('edit-profile')
  async editProfile(
    @Request() req,
    @Body() editProfileDto: UserEditProfileDto,
    @Res() res: Response,
  ) {
    return this.authService.editProfile(req.user, editProfileDto, res);
  }
}
