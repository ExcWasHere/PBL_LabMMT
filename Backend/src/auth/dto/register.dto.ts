import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  validationField?: string;

  @IsOptional()
  cvPath?: string;
}
