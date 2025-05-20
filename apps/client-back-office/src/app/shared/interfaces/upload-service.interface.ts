import { Observable } from 'rxjs';

export interface UploadService {
  getImages: (id: string) => Observable<{ name: string }[]>;
  uploadImage: (id: string, formData: FormData) => Observable<{ body: { name: string } }>;
  deleteImage: (fileName: string) => Observable<{ message: string }>;
  getImageUrl: (fileName: string) => string;
}
