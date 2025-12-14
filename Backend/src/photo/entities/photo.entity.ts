import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  photoUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  // @Column({ type: 'varchar', length: 255, nullable: true })
  // location: string;

  // @Column({ name: 'cover_url', type: 'text', nullable: true })
  // coverUrl: string;

  // @Column({ type: 'date', nullable: true })
  // date: Date;

  @Column({
    type: 'enum',
    enum: ['Published', 'Review', 'Waiting', 'Muted', 'Rejected'],
    default: 'Review',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
