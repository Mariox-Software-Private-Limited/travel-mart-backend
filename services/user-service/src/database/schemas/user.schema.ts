import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from './role.schema';
import { hash, compare } from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ unique: true, trim: true })
  userName: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }],
    required: true,
  })
  roles: Role[];

  @Prop({ type: String, default: null })
  resetOtp?: string;

  @Prop({ type: Date, default: null })
  otpExpiry?: Date;

  @Prop({ default: null })
  profilePicture?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  // New Vendor Registration Fields
  @Prop({ required: true, trim: true })
  agencyName: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  natureOfBusiness: string;

  @Prop({ required: true, trim: true })
  businessType: string;

  @Prop({ required: true, trim: true })
  preferredCurrency: string;

  @Prop({ trim: true })
  howDidYouHear?: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  pincode: string;

  @Prop({ required: true, trim: true })
  mobileNumber: string;

  @Prop({ trim: true })
  fax?: string;

  @Prop({ required: true, trim: true })
  timeZone: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ required: true, trim: true })
  designation: string;

  @Prop({ required: true, enum: ['Approved', 'Not Approved'] })
  IATAStatus: string;

  @Prop({ required: true, trim: true })
  telephone: string;

  // Contact Details
  @Prop({ required: true, type: Object })
  accounts: {
    name: string;
    email: string;
    number: string;
  };

  @Prop({ type: Object, default: null })
  reservationOperations?: {
    name?: string;
    email?: string;
    number?: string;
  };

  @Prop({ type: Object, default: null })
  management?: {
    name?: string;
    email?: string;
    number?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for optimized querying
UserSchema.index({ email: 1, isDeleted: 1 });
UserSchema.index({ firstName: 1, lastName: 1 });
UserSchema.index({ roles: 1, isActive: 1 });
UserSchema.index({ lastLoginAt: -1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ isDeleted: 1 });
UserSchema.index({ agencyName: 1, country: 1 });
UserSchema.index({ city: 1, natureOfBusiness: 1 });

// Password hashing middleware
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 10);

  // Generate userName on create only
  if (this.isNew && !this.userName) {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    this.userName = `${this.firstName.toLowerCase()}${randomNumber}`;
  }

  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return compare(enteredPassword, this.password);
};
