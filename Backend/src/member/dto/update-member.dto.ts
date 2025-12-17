import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  IsObject,
} from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  identityNum?: string;

  @IsOptional()
  @IsString()
  role: 'dosen' | 'mahasiswa' | 'admin';

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  field?: string;

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
  nip?: string;

  @IsOptional()
  @IsString()
  nidn?: string;

  @IsOptional()
  @IsString()
  prodi?: string;

  @IsOptional()
  @IsString()
  jabatan_akademik?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pendidikan?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sertifikasi?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  matkul_ganjil?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  matkul_genap?: string[];

  @IsOptional()
  @IsObject()
  social_links?: {
    linkedin?: string;
    email?: string;
    scholar?: string;
    sinta?: string;
    cv?: string;
  };
}
