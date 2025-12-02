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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
