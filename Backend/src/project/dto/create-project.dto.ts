import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  kategori: string;

  @IsDateString()
  year: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  publisher: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Published', 'Review', 'Waiting', 'Muted'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  tech?: string;

  @IsString()
  @IsOptional()
  githubLink?: string;

  @IsString()
  @IsOptional()
  demoLink?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsArray()
  @IsOptional()
  mediaUrls?: string[];

  @IsArray()
  @IsOptional()
  teamMembers?: { name: string; role: string; imageUrl?: string }[];
}
