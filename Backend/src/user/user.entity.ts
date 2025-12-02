import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  DOSEN = 'dosen',
  MAHASISWA = 'mahasiswa',
  VIEWER = 'viewer',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MAHASISWA,
  })
  role: UserRole;

  @Column({
    name: 'validation_field',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  validationField?: string | null;

  @Column({
    name: 'cv_path',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  cvPath?: string | null;
}
