import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news')
export class News {
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

  @Column({
    type: 'enum',
    enum: ['Published', 'Review', 'Waiting', 'Muted'],
    default: 'Waiting',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
