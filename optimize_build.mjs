import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import archiver from 'archiver';

const SOURCE_DIR = './dist/public';
const TARGET_DIR = './dist_optimized';
const OUTPUT_ZIP = './CLEAN-HEIGHTS-LITE.zip';

// Ensure targeting the correct relative path
const projectRoot = process.cwd();
const sourcePath = path.resolve(projectRoot, SOURCE_DIR);
const targetPath = path.resolve(projectRoot, TARGET_DIR);

async function optimizeFolder(dir, targetBase) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  if (!fs.existsSync(targetBase)) {
    fs.mkdirSync(targetBase, { recursive: true });
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePart = path.relative(sourcePath, fullPath);
    const targetFilePath = path.join(targetPath, relativePart);

    if (entry.isDirectory()) {
      await optimizeFolder(fullPath, targetFilePath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        console.log(`Optimizing: ${relativePart}`);
        try {
          let pipeline = sharp(fullPath).resize({ width: 1000, withoutEnlargement: true });
          
          if (ext === '.png') {
            // Keep PNG extension to avoid broken links, but compress it
            await pipeline.png({ quality: 60, compressionLevel: 9 }).toFile(targetFilePath);
          } else {
            await pipeline.jpeg({ quality: 65, mozjpeg: true }).toFile(targetFilePath);
          }
        } catch (err) {
          console.error(`Failed to optimize ${fullPath}:`, err);
          fs.copyFileSync(fullPath, targetFilePath);
        }
      } else {
        // Copy other files as is
        fs.copyFileSync(fullPath, targetFilePath);
      }
    }
  }
}

async function createZip(sourceDir, outPath) {
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Zip complete: ${archive.pointer()} total bytes`);
      resolve();
    });
    archive.on('error', (err) => reject(err));
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function run() {
  console.log('--- Starting Build Optimization ---');
  
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  await optimizeFolder(sourcePath, targetPath);
  console.log('Images optimized. Creating ZIP...');
  
  await createZip(targetPath, path.resolve(projectRoot, OUTPUT_ZIP));
  console.log('--- Optimization Complete ---');
}

run().catch(console.error);
