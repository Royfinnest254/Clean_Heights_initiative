import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import archiver from 'archiver';

const SOURCE_DIR = './dist/public';
const TARGET_DIR = './dist_ultra_optimized';
const OUTPUT_ZIP = './production_build_final.zip';

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
        console.log(`Optimizing image: ${relativePart}`);
        try {
          // Limit image width to 800px for ultra-efficiency while retaining great clarity
          let pipeline = sharp(fullPath).rotate().resize({ width: 800, withoutEnlargement: true });
          
          if (ext === '.png') {
            await pipeline.png({ quality: 50, compressionLevel: 9 }).toFile(targetFilePath);
          } else {
            await pipeline.jpeg({ quality: 50, mozjpeg: true }).toFile(targetFilePath);
          }
        } catch (err) {
          console.error(`Failed to optimize ${fullPath}:`, err);
          fs.copyFileSync(fullPath, targetFilePath);
        }
      } else {
        // Copy other files as-is
        fs.copyFileSync(fullPath, targetFilePath);
      }
    }
  }
}

async function createZip(sourceDir, outPath) {
  // Overwrite existing file by creating a new write stream
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } }); // Maximum compression level

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Zip complete: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB total size`);
      resolve();
    });
    archive.on('error', (err) => reject(err));
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function run() {
  console.log('--- Starting Ultra-Optimization Build Zipping ---');
  
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }

  // Double check that source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source directory ${sourcePath} does not exist. Please build the project first.`);
    process.exit(1);
  }

  await optimizeFolder(sourcePath, targetPath);
  console.log('Images successfully compressed. Packaging into production_build_final.zip...');
  
  await createZip(targetPath, path.resolve(projectRoot, OUTPUT_ZIP));
  console.log('--- Ultra-Optimization & Packaging Complete ---');
}

run().catch(console.error);
