import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  kategori: string;

  @Column({ type: 'date' })
  year: Date;

  @Column({ type: 'varchar', length: 255 })
  publisher: string;

  @Column({ type: 'int', default: 0 })
  stars: number;

  @Column({
    type: 'enum',
    enum: ['Published', 'Review', 'Waiting', 'Muted'],
    default: 'Waiting',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tech: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  githubLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  demoLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnailUrl: string;

  @Column('text', { array: true, nullable: true })
  mediaUrls: string[];

  @Column({ type: 'jsonb', nullable: true })
  teamMembers: { name: string; role: string; imageUrl?: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
