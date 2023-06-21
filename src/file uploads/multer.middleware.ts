import { extname } from 'path';
import { BadRequestException, Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Unsupported file format'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
};

export function multerMiddleware() {
  return multerOptions;
}
