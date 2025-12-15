import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  kategori?: string;

  @IsOptional()
  year?: Date;

  @IsOptional()
  description?: string;

  @IsOptional()
  tech?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsNumber()
  stars?: number;
}
