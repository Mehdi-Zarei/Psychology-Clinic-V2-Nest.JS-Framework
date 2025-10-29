import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadService {
  getFileUrl(file: Express.Multer.File): string {
    return `/public/${file.filename}`;
  }
}
