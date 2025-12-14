export class CreateVideoDto {
  title: string;
  videoUrl: string;
  galleryId?: string;
  publisher?: string; // ✅ Tambahkan
  date?: string;
  status?: string; // ✅ Tambahkan
  description?: string;
}
