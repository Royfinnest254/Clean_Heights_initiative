import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const slidesDir = path.join(process.cwd(), 'client', 'public', 'slides');

async function enhanceSlides() {
  const files = fs.readdirSync(slidesDir);
  const tasks = [];

  for (const f of files) {
    const file = path.join(slidesDir, f);
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      tasks.push(async () => {
        try {
          const tempFile = file + '.tmp';
          await sharp(file)
            .rotate() // Correct rotation
            .normalise() // Auto-adjust contrast
            .modulate({ brightness: 1.05, saturation: 1.15 }) // Premium color saturation pop
            .sharpen({ sigma: 1.0, flat: 1.0, jagged: 2.0 }) // Apply subtle, clean sharpening to remove blurriness
            .toFile(tempFile);
          
          fs.renameSync(tempFile, file);
          console.log(`Successfully enhanced: ${f}`);
        } catch (e) {
          console.error(`Error processing ${f}:`, e.message);
        }
      });
    }
  }

  console.log(`Starting image enhancement for ${tasks.length} slides...`);
  for (const task of tasks) {
    await task();
  }
  console.log('All slides enhanced with high contrast, crisp sharpening, and vibrant colors.');
}

enhanceSlides();
