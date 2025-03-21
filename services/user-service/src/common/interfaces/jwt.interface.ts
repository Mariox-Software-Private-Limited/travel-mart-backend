export interface JwtPayload {
  _id: string;
  userId: string;
  roles: string;
  permission?: Array<string>;
}
