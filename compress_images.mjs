import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirInfo = "dist/public";

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|jpe?g|webp)$/i.test(fullPath)) {
      if (stat.size > 150 * 1024) { // only process > 150KB
        console.log(`Compressing ${fullPath} (${(stat.size/1024/1024).toFixed(2)} MB)...`);
        const tempPath = fullPath + '.tmp';
        try {
          await sharp(fullPath)
             .rotate() // Auto-rotates the image physically upright based on phone EXIF data
             .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
             .jpeg({ quality: 45, mozjpeg: true, force: false })
             .png({ quality: 45, compressionLevel: 9, force: false })
             .toFile(tempPath);
          fs.renameSync(tempPath, fullPath);
        } catch(e) {
          console.error("Error on " + fullPath, e);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
      }
    }
  }
}

processDirectory(dirInfo).then(() => console.log('Done compressing.'));
