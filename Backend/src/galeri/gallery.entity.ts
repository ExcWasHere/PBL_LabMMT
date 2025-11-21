import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { GalleryImage } from "./gallery-image.entity";

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 150})
  title: string;

  @Column({ type: "text", length: 500})
  description: string;

  @Column({ type: "date" })
  date: string;

  @Column({type: 'varchar', length: 150})
  location: string;

  @OneToMany(() => GalleryImage, (image) => image.gallery)
  images: GalleryImage[];
}
