export class CreatePhotoDto {
  title: string;
  photoUrl: string;
  galleryId?: string;
  publisher?: string; // ✅ Tambahkan
  location?: string;
  date?: string;
  status?: string; // ✅ Tambahkan
  description?: string;
}
