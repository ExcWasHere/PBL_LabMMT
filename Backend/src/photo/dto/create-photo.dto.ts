import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  // Terima string tanggal atau Date object
  date?: Date | string; 

  @IsOptional()
  @IsString()
  status?: string; // <--- PENTING: Agar status 'Review' tidak dibuang

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  cover_url?: string;
  
  @IsOptional()
  @IsString()
  location?: string;
}