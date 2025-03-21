import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/database/schemas/role.schema';

@Injectable()
export class RoleService implements OnModuleInit {
  private readonly logger = new Logger(RoleService.name);

  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  async seedRoles() {
    const defaultRoles = [
      { name: 'Super Admin', permissions: ['ALL'] },
      { name: 'Sub Admin', permissions: ['MANAGE_USERS', 'MANAGE_ROLES'] },
      { name: 'User', permissions: ['READ', 'WRITE'] },
      { name: 'Sub User', permissions: ['READ'] },
    ];

    for (const role of defaultRoles) {
      const existingRole = await this.roleModel.findOne({ name: role.name });
      if (!existingRole) {
        await this.roleModel.create(role);
        this.logger.log(`✅ Role "${role.name}" added to database.`);
      }
    }
  }
}
