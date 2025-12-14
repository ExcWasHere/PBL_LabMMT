import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gallery } from '../../gallery/gallery.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'photoUrl', type: 'varchar', length: 500 })
  photoUrl: string;

  @Column({ name: 'gallery_id', type: 'uuid', nullable: true })
  galleryId: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gallery_id' })
  gallery: Gallery;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

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
