import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from 'src/database/schemas/admin.schema';
import { AdminLoginDto, AdminRegisterDto } from './dto/admin.dto';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { JwtPayload } from 'src/common//interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import {
  ADMIN_LOGIN,
  RESPONSE_SUCCESS,
} from 'src/common/constants/response.constant';
import { successResponse } from 'src/common/helpers/responses/success.helper';
import { Response } from 'express';
import { statusOk } from 'src/common/constants/response.status.constant';
import { AdminEditProfileDto } from './dto/admin-edit-profile.dto';
import { sendEmail } from 'src/common/helpers/email.helper';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  generateAuthToken(user: any) {
    const payload: JwtPayload = {
      _id: user._id,
      userId: user._id,
      roles: user.roles,
      permission: user?.permission,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_TOKEN_EXPIRY_TIME,
    });
  }

  async register(adminDto: AdminRegisterDto) {
    console.log('AdminService =>>> Register');

    const email = adminDto.email.toLowerCase();
    const existingAdmin = await this.adminModel.findOne({ email });

    if (existingAdmin) {
      throw new BadRequestException('Admin with this email already exists.');
    }

    const newAdmin = new this.adminModel({
      ...adminDto,
      email,
    });

    await newAdmin.save();
    return { message: 'Admin registered successfully!' };
  }

  async login(body: AdminLoginDto, res: Response) {
    console.log('AdminService =>>> Login');
    // eslint-disable-next-line prefer-const
    let { email, password } = body;
    email = email.toLowerCase();

    if (!process.env.JWT_SECRET) {
      throw new Error(
        'JWT secret key is not defined. Please check your .env file.',
      );
    }

    const admin = await this.adminModel
      .findOne({ email })
      .select('email firstName lastName _id roles password')
      .populate('roles')
      .lean();

    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const roles = admin.roles.map((role) => role.name);
    const permissions = admin.roles.flatMap((role) => role.permissions || []);

    const authObj = {
      _id: admin._id,
      roles,
      permissions,
    };

    const accessToken = this.generateAuthToken(authObj);
    const encryptedToken = this.cryptoService.encrypt(accessToken);

    const succMessage = ADMIN_LOGIN;

    const loginUser = {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      accessToken: encryptedToken,
      role: roles,
    };

    return res
      .status(statusOk)
      .json(successResponse(succMessage, loginUser, statusOk));
  }

  async forgotPassword(email: string) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin) throw new BadRequestException('Admin not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOtp = otp;
    admin.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    await sendEmail(admin.email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, otp: string) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin || admin.resetOtp !== otp || new Date() > admin.otpExpiry) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    return { message: 'OTP verified successfully' };
  }

  async resendOtp(email: string) {
    return this.forgotPassword(email);
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin || admin.resetOtp !== otp || new Date() > admin.otpExpiry) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOtp = null;
    admin.otpExpiry = null;
    await admin.save();

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    adminId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isPasswordValid)
      throw new BadRequestException('Old password is incorrect');

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return { message: 'Password changed successfully' };
  }

  async getAdminDetail(admin: AdminDocument, res: Response) {
    if (!admin) throw new BadRequestException('Admin not found');

    const roles = admin.roles.map((role) => role.name);
    const permissions = admin.roles.flatMap((role) => role.permissions || []);

    return res.status(statusOk).json(
      successResponse(
        RESPONSE_SUCCESS,
        {
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          profilePicture: admin.profilePicture,
          isActive: admin.isActive,
          isEmailVerified: admin.isEmailVerified,
          lastLoginAt: admin.lastLoginAt,
          roles,
          permissions,
        },
        statusOk,
      ),
    );
  }

  /**
   * Edit Admin
   */

  async editProfile(
    admin: AdminDocument,
    editProfileDto: AdminEditProfileDto,
    res: Response,
  ) {
    console.log('AdminService =>>> Edit Profile');

    // ✅ Update only firstName & lastName
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      admin._id,
      {
        firstName: editProfileDto.firstName,
        lastName: editProfileDto.lastName,
      },
      { new: true },
    );

    return res.status(200).json({
      message: 'Profile updated successfully!',
      data: {
        _id: updatedAdmin._id,
        firstName: updatedAdmin.firstName,
        lastName: updatedAdmin.lastName,
      },
    });
  }
}
