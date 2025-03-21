import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from './role.schema';
import { hash, compare } from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.PASSWORD_SECRET_KEY;

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  encryptedPassword?: string; // ✅ Made optional to avoid validation error

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ default: null })
  profilePicture?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }],
    required: true,
  })
  roles: Role[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, default: null })
  emailVerificationOtp?: string; // OTP for email verification

  @Prop({ type: Date, default: null })
  emailVerificationExpiry?: Date; // Expiry for email verification OTP

  @Prop({ type: String, default: null })
  resetOtp?: string; // OTP for password reset

  @Prop({ type: Date, default: null })
  otpExpiry?: Date; // Expiry time for reset OTP

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// ✅ Add necessary indexes
AdminSchema.index({ email: 1, isDeleted: 1 });
AdminSchema.index({ firstName: 1, lastName: 1 });
AdminSchema.index({ roles: 1, isActive: 1 });
AdminSchema.index({ lastLoginAt: -1 });

// ✅ Move password encryption to pre('validate') to ensure `encryptedPassword` is set before validation
AdminSchema.pre<AdminDocument>('validate', async function (next) {
  if (!this.isModified('password')) return next();

  console.log('🔑 Original Password:', this.password);

  // ✅ Encrypt **original password** before validation
  this.encryptedPassword = CryptoJS.AES.encrypt(
    this.password,
    SECRET_KEY,
  ).toString();
  console.log('🔒 Encrypted Password:', this.encryptedPassword);

  // ✅ Then, hash the password for authentication
  this.password = await hash(this.password, 10);
  console.log('🔑 Hashed Password:', this.password);

  next();
});

// ✅ Compare passwords method
AdminSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return compare(enteredPassword, this.password);
};

// ✅ Decrypt stored password
AdminSchema.methods.getDecryptedPassword = function (): string {
  const bytes = CryptoJS.AES.decrypt(this.encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
