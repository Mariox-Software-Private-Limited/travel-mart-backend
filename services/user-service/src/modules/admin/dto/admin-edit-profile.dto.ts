import { IsString, MaxLength } from 'class-validator';

export class AdminEditProfileDto {
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;
}
