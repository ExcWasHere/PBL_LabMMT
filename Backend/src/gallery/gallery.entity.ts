import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Photo } from '../photo/entities/photo.entity';
import { Video } from '../video/entities/video.entity';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({
    type: 'enum',
    enum: ['Published', 'Review', 'Waiting', 'Muted', 'Rejected'],
    default: 'Review',
  })
  status: string;

  @OneToMany(() => Photo, (photo) => photo.gallery)
  photos: Photo[];

  @OneToMany(() => Video, (video) => video.gallery)
  videos: Video[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
