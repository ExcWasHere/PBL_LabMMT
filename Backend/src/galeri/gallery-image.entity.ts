import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Gallery } from './gallery.entity';

@Entity()
export class GalleryImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  fileUrl: string;

  @ManyToOne(() => Gallery, (gallery) => gallery.images, {
    onDelete: 'CASCADE',
  })
  gallery: Gallery;
}
