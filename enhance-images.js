import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'client', 'public', 'milestones');

function walk(dirPath, callback) {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return;
  }
  fs.readdirSync(dirPath).forEach(f => {
    let fullPath = path.join(dirPath, f);
    let isDirectory = fs.statSync(fullPath).isDirectory();
    isDirectory ? walk(fullPath, callback) : callback(fullPath);
  });
}

async function processImages() {
  const tasks = [];
  walk(dir, (file) => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      tasks.push(async () => {
        try {
          const tempFile = file + '.tmp';
          await sharp(file)
            .rotate() // Use EXIF data to rotate upright
            .normalise() // Improve contrast and reduce dullness
            .modulate({ brightness: 1.05, saturation: 1.2 }) // Slight color pop
            .toFile(tempFile);
          
          fs.renameSync(tempFile, file);
          console.log(`Success: ${path.basename(file)}`);
        } catch (e) {
          console.error(`Error processing ${path.basename(file)}:`, e.message);
        }
      });
    }
  });

  console.log(`Found ${tasks.length} images to process. Starting...`);
  for (const task of tasks) {
    await task();
  }
  console.log('All images processed successfully.');
}

processImages();
