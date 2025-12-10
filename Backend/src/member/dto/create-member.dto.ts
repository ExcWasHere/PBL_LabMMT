import {
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  IsEnum,
} from 'class-validator';

export class CreateMemberDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  name: string;

  @IsString()
  identityNum: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  position?: 'researcher' | 'admin';

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsEnum(['pending', 'active'])
  status?: string;

  @IsOptional()
  @IsString()
  startDate?: string;
}
