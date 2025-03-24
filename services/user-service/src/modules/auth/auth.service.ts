import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import {
  UserChangePasswordDto,
  UserLoginDto,
  UserRegisterDto,
  UserResendOtpDto,
  UserResetPasswordDto,
  UserVerifyOtpDto,
} from './dto/user.dto';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { JwtPayload } from 'src/common/interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import {
  USER_LOGIN,
  RESPONSE_SUCCESS,
  USER_REGISTER,
  USER_ALREADY_FOUND,
  INVALID_PASS,
  INVALID_CRED,
  FORGOT_PASSWORD,
} from 'src/common/constants/response.constant';
import {
  successResponse,
  badResponse,
} from 'src/common/helpers/responses/success.helper';
import { Response } from 'express';
import {
  statusBadRequest,
  statusOk,
  statusUnauthorized,
} from 'src/common/constants/response.status.constant';
import { UserEditProfileDto } from './dto/user-edit-profile.dto';
import { sendEmail } from 'src/common/helpers/email.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  async register(userDto: UserRegisterDto, res: Response) {
    console.log('AuthService =>>> Register');

    const email = userDto.email.toLowerCase();
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(statusBadRequest)
        .json(badResponse(USER_ALREADY_FOUND, {}, statusOk));
    }

    // const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const newUser = new this.userModel({
      ...userDto,
      email,
    });

    await newUser.save();
    const succMessage = USER_REGISTER;

    return res
      .status(statusOk)
      .json(successResponse(succMessage, {}, statusOk));
  }

  async login(body: UserLoginDto, res: Response) {
    console.log('AuthService =>>> Login');

    const { email, password } = body;

    if (!email || !password) {
      return res
        .status(statusBadRequest)
        .json(
          badResponse(
            'Email/Username and Password are required',
            {},
            statusBadRequest,
          ),
        );
    }

    // To handle both email and username using one key: `email`
    const searchQuery = {
      $or: [{ email: email.toLowerCase() }, { userName: email }],
    };

    const user = await this.userModel
      .findOne(searchQuery)
      .select('email firstName lastName _id roles password')
      .populate('roles')
      .lean();

    if (!user) {
      return res
        .status(statusBadRequest)
        .json(badResponse(INVALID_CRED, {}, statusBadRequest));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(statusBadRequest)
        .json(badResponse(INVALID_PASS, {}, statusBadRequest));
    }

    const roles = user.roles.map((role) => role.name);
    const permissions = user.roles.flatMap((role) => role.permissions || []);

    const authObj = {
      _id: user._id,
      roles,
      permissions,
    };

    const accessToken = this.generateAuthToken(authObj);
    const encryptedToken = this.cryptoService.encrypt(accessToken);

    const loginUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: encryptedToken,
      role: roles,
    };

    return res
      .status(statusOk)
      .json(successResponse(USER_LOGIN, loginUser, statusOk));
  }

  async forgotPassword(email: string, res: Response) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log('otp=>>', otp);
    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(user.email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    return res
      .status(statusOk)
      .json(successResponse(FORGOT_PASSWORD, {}, statusOk));
  }

  async verifyOtp(body: UserVerifyOtpDto, res: Response) {
    const { email, otp } = body;

    if (!email || !otp) {
      return res
        .status(statusBadRequest)
        .json(
          badResponse(
            'Email/Username and OTP are required',
            {},
            statusBadRequest,
          ),
        );
    }

    const searchQuery = {
      $or: [{ email: email.toLowerCase() }, { userName: email }],
    };

    const user = await this.userModel
      .findOne(searchQuery)
      .select('email userName resetOtp otpExpiry firstName lastName _id roles')
      .populate('roles')
      .lean();

    if (!user) {
      return res
        .status(statusBadRequest)
        .json(badResponse('User not found', {}, statusBadRequest));
    }

    if (user.resetOtp != otp || new Date() > user.otpExpiry) {
      return res
        .status(statusBadRequest)
        .json(badResponse('Invalid or expired OTP', {}, statusBadRequest));
    }

    const roles = user.roles.map((role) => role.name);
    const permissions = user.roles.flatMap((role) => role.permissions || []);

    const authObj = {
      _id: user._id,
      roles,
      permissions,
    };

    const accessToken = this.generateAuthToken(authObj);
    const encryptedToken = this.cryptoService.encrypt(accessToken);

    const loginUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: encryptedToken,
      role: roles,
    };

    return res
      .status(statusOk)
      .json(successResponse('OTP verified successfully', loginUser, statusOk));
  }

  async resendOtp(body: UserResendOtpDto, res: Response) {
    const email = body.email;
    if (!email) {
      return res
        .status(statusBadRequest)
        .json(
          badResponse('Email or Username is required', {}, statusBadRequest),
        );
    }

    const searchQuery = {
      $or: [{ email: email.toLowerCase() }, { userName: email }],
    };

    const user = await this.userModel.findOne(searchQuery);

    if (!user) {
      return res
        .status(statusBadRequest)
        .json(badResponse('User not found', {}, statusBadRequest));
    }

    // Optional: Prevent spamming resend (limit OTP sending frequency)
    if (
      user.otpExpiry &&
      new Date() < new Date(user.otpExpiry.getTime() - 9 * 60 * 1000)
    ) {
      return res
        .status(statusBadRequest)
        .json(
          badResponse(
            'Please wait before requesting another OTP',
            {},
            statusBadRequest,
          ),
        );
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('Resend OTP =>>', otp);

    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    await sendEmail(user.email, 'Resend OTP', `Your OTP is: ${otp}`);

    return res
      .status(statusOk)
      .json(successResponse('OTP resent successfully', {}, statusOk));
  }

  async resetPassword(req: any, body: UserResetPasswordDto, res: Response) {
    const { _id } = req.user;
    const { newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      return res
        .status(statusBadRequest)
        .json(
          badResponse(
            'New password and confirm password do not match',
            {},
            statusBadRequest,
          ),
        );
    }

    const user = await this.userModel.findById(_id);
    if (!user) {
      return res
        .status(statusBadRequest)
        .json(badResponse('User not found', {}, statusBadRequest));
    }

    user.password = newPassword; // will be hashed by pre-save middleware
    user.resetOtp = null;
    user.otpExpiry = null;

    await user.save(); // triggers pre('save') and hashes the password

    return res
      .status(statusOk)
      .json(successResponse('Password reset successfully', {}, statusOk));
  }

  async changePassword(req: any, body: UserChangePasswordDto, res: Response) {
    const { _id } = req.user;
    const { oldPassword, newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      return res
        .status(statusBadRequest)
        .json(
          badResponse(
            'New password and confirm password do not match',
            {},
            statusBadRequest,
          ),
        );
    }

    const user = await this.userModel.findById(_id);
    if (!user) {
      return res
        .status(statusUnauthorized)
        .json(badResponse('User not found', {}, statusUnauthorized));
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(statusBadRequest)
        .json(badResponse('Old password is incorrect', {}, statusBadRequest));
    }

    user.password = newPassword; // will be hashed by pre-save middleware
    await user.save();

    return res
      .status(statusOk)
      .json(successResponse('Password changed successfully', {}, statusOk));
  }

  async getUserDetail(user: UserDocument, res: Response) {
    if (!user) throw new BadRequestException('User not found');

    const roles = user.roles.map((role) => role.name);
    const permissions = user.roles.flatMap((role) => role.permissions || []);

    return res.status(statusOk).json(
      successResponse(
        RESPONSE_SUCCESS,
        {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          roles,
          permissions,
        },
        statusOk,
      ),
    );
  }

  async editProfile(
    user: UserDocument,
    editProfileDto: UserEditProfileDto,
    res: Response,
  ) {
    console.log('AuthService =>>> Edit Profile');

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        firstName: editProfileDto.firstName,
        lastName: editProfileDto.lastName,
      },
      { new: true },
    );

    return res.status(200).json({
      message: 'Profile updated successfully!',
      data: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  }
}
