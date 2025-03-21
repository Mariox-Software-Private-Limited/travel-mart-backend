import { SetMetadata } from "@nestjs/common";
import { SubAdminRole } from "../interfaces/enum.interface";

export const ROLES_KEY = "roles";
export const Roles = (...roles: SubAdminRole[]) =>
  SetMetadata(ROLES_KEY, roles);
