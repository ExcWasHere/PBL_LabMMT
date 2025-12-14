import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gallery } from 'src/gallery/gallery.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'videoUrl', type: 'varchar', length: 500 })
  videoUrl: string;

  @Column({ name: 'gallery_id', type: 'uuid', nullable: true })
  galleryId: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gallery_id' })
  gallery: Gallery;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

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
