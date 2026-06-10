import sharp from 'sharp';
import path from 'path';
import ensureDir from '../utils/ensureDir.js';
import generateFileName from '../utils/generateFileName.js';

export const saveOptimizedImage = async ({
  file,
  folder,
  width = 1200,
  quality = 75,
  prefix = 'image',
}) => {
  const uploadDir = path.join(
    process.cwd(),
    'uploads',
    folder
  );

  ensureDir(uploadDir);

  const fileName = generateFileName(
    file.originalname,
    prefix
  );

  const outputPath = path.join(
    uploadDir,
    fileName
  );

  await sharp(file.buffer)
    .resize({
      width,
      withoutEnlargement: true,
    })
    .webp({
      quality,
    })
    .toFile(outputPath);

  return {
    fileName,
    path: `/uploads/${folder}/${fileName}`,
  };
};
