import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { BadRequestException } from "@nestjs/common";

export const multerConfig = (destination: string, maxSizeMB: number, allowedTypes: string[]) => {
  const fullPath = path.resolve(destination);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
      },
    }),
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new BadRequestException("فرمت فایل معتبر نیست. فقط فایل‌های مجاز را آپلود کنید."), false);
      }
    },
    limits: {
      fileSize: maxSizeMB * 1024 * 1024, // MB
    },
  };
};
