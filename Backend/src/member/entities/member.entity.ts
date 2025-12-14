import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  identityNum: string;

  @Column()
  role: 'dosen' | 'mahasiswa' | 'admin';

  // =====================================================
  // REQUIRED by your existing MemberService + DB
  // =====================================================

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cvUrl: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'active'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  // =====================================================
  // NEW FIELDS (lecturer)
  // =====================================================

  @Column({ type: 'varchar', length: 255, nullable: true })
  nip?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nidn?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prodi?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jabatan_akademik?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  tags?: string[];

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  pendidikan?: string[];

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  sertifikasi?: string[];

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  matkul_ganjil?: string[];

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  matkul_genap?: string[];

  @Column({ type: 'json', nullable: true })
  social_links?: {
    linkedin?: string;
    email?: string;
    scholar?: string;
    sinta?: string;
    cv?: string;
  };

  @Column({ type: 'varchar', length: 500, nullable: true })
  photoUrl?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  slug?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
