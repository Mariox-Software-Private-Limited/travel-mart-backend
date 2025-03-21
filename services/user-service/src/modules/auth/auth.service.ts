import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { UserLoginDto, UserRegisterDto } from './dto/user.dto';
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
} from 'src/common/constants/response.constant';
import {
  successResponse,
  badResponse,
} from 'src/common/helpers/responses/success.helper';
import { Response } from 'express';
import {
  statusBadRequest,
  statusOk,
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

    // eslint-disable-next-line prefer-const
    let { email, password, userName } = body;
    email = email.toLowerCase();

    const user = await this.userModel
      .findOne({ userName, email })
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

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // user.resetOtp = otp;
    // user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(user.email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    return { message: 'OTP sent to your email' };
  }

  //   async verifyOtp(email: string, otp: string) {
  // const user = await this.userModel.findOne({ email });
  // if (!user || user.resetOtp !== otp || new Date() > user.otpExpiry) {
  //   throw new BadRequestException('Invalid or expired OTP');
  // }

  //     return { message: 'OTP verified successfully' };
  //   }

  async resendOtp(email: string) {
    return this.forgotPassword(email);
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    // if (!user || user.resetOtp !== otp || new Date() > user.otpExpiry) {
    //   throw new BadRequestException('Invalid or expired OTP');
    // }

    user.password = await bcrypt.hash(newPassword, 10);
    // user.resetOtp = null;
    // user.otpExpiry = null;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid)
      throw new BadRequestException('Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password changed successfully' };
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
