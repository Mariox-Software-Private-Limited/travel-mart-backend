import {
  Controller,
  Post,
  Body,
  Patch,
  Res,
  Get,
  UseGuards,
  Request,
  Put,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterDto,
  UserLoginDto,
  UserForgotPasswordDto,
  UserResetPasswordDto,
  UserChangePasswordDto,
  UserVerifyOtpDto,
  UserResendOtpDto,
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
  forgotPassword(
    @Body() forgotPasswordDto: UserForgotPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.email, res);
  }

  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: UserVerifyOtpDto, @Res() res: Response) {
    return this.authService.verifyOtp(verifyOtpDto, res);
  }

  @Public()
  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: UserResendOtpDto, @Res() res: Response) {
    return this.authService.resendOtp(resendOtpDto, res);
  }

  @Post('reset-password')
  resetPassword(
    @Body() resetPasswordDto: UserResetPasswordDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    return this.authService.resetPassword(req, resetPasswordDto, res);
  }

  @Patch('change-password')
  changePassword(
    @Req() req: any,
    @Body() changePasswordDto: UserChangePasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.changePassword(req, changePasswordDto, res);
  }

  @Get('profile')
  async getUserDetail(@Request() req, @Res() res: Response) {
    return this.authService.getUserDetail(req.user, res);
  }

  @Put('profile')
  async editProfile(
    @Request() req: any,
    @Body() editProfileDto: UserEditProfileDto,
    @Res() res: Response,
  ) {
    return this.authService.editProfile(req.user, editProfileDto, res);
  }
}
