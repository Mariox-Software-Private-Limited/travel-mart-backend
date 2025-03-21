import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './mongoose.config';
import { User, UserSchema } from './schemas/user.schema';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { Role, RoleSchema } from './schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.LOCAL_MONGO_DB, mongooseConfig),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
