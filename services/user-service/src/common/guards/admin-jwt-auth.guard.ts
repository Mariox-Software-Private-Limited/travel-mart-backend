import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/database/schemas/admin.schema';
import { CryptoService } from '../crypto/crypto.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly reflector: Reflector,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    // ✅ Skip authentication for public routes
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    let token = authorizationHeader.split(' ')[1];

    // ✅ Decrypt token if needed
    if (token.includes('+') || token.includes('/') || token.includes('=')) {
      token = this.cryptoService.decrypt(token);
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // ✅ Fetch admin from database
      const admin = await this.adminModel
        .findById(decoded._id)
        .select('-password -resetOtp -otpExpiry')
        .populate('roles')
        .lean();

      if (!admin) {
        throw new UnauthorizedException('Admin does not exist');
      }

      if (!admin.isActive) {
        throw new UnauthorizedException('Your account is deactivated');
      }

      // ✅ Attach admin to request
      request.admin = admin;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
