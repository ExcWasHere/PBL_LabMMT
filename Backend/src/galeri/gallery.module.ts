import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gallery } from "./gallery.entity";
import { GalleryImage } from "./gallery-image.entity";
import { GalleryService } from "./gallery.service";

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, GalleryImage])],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
