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
import { AdminService } from './admin.service';
import {
  AdminRegisterDto,
  AdminLoginDto,
  AdminForgotPasswordDto,
  AdminVerifyOtpDto,
  AdminResendOtpDto,
  AdminResetPasswordDto,
  AdminChangePasswordDto,
} from './dto/admin.dto';
import { Response } from 'express';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ADMIN_LOGIN } from 'src/common/constants/response.constant';
import { AdminJwtAuthGuard } from 'src/common/guards/admin-jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { AdminEditProfileDto } from './dto/admin-edit-profile.dto';

@UseGuards(AdminJwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post('register')
  async register(@Body() adminDto: AdminRegisterDto) {
    return this.adminService.register(adminDto);
  }

  @Public()
  @ResponseMessage(ADMIN_LOGIN)
  @Post('login')
  login(@Body() loginDto: AdminLoginDto, @Res() res: Response) {
    return this.adminService.login(loginDto, res);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: AdminForgotPasswordDto) {
    return this.adminService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: AdminVerifyOtpDto) {
    return this.adminService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Public()
  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: AdminResendOtpDto) {
    return this.adminService.resendOtp(resendOtpDto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: AdminResetPasswordDto) {
    return this.adminService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.newPassword,
    );
  }

  @Patch('change-password/:id')
  changePassword(
    @Param('id') adminId: string,
    @Body() changePasswordDto: AdminChangePasswordDto,
  ) {
    return this.adminService.changePassword(
      adminId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('details')
  async getAdminDetail(@Request() req, @Res() res: Response) {
    return this.adminService.getAdminDetail(req.admin, res); // ✅ Pass the `admin` from request
  }

  @Put('edit-profile')
  async editProfile(
    @Request() req,
    @Body() editProfileDto: AdminEditProfileDto,
    @Res() res: Response,
  ) {
    return this.adminService.editProfile(req.admin, editProfileDto, res);
  }
}
