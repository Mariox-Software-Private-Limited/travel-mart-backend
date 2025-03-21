import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ default: [], type: [String] })
  permissions: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({ name: 1, isDeleted: 1 });
RoleSchema.index({ isActive: 1 });
RoleSchema.index({ isDeleted: 1 });
