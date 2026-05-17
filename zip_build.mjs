import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

async function createZip(sourceDir, outPath) {
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('Archive completed.');
      resolve();
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        process.emitWarning(err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Zip the CONTENTS of the source directory
    archive.directory(sourceDir, false);

    archive.finalize();
  });
}

const source = './dist/public';
const out = './CLEAN-HEIGHTS-FINAL.zip';

console.log(`Zipping contents of ${source} to ${out}...`);
createZip(source, out)
  .then(() => {
    console.log('Zip creation successful!');
  })
  .catch(err => {
    console.error('Zip creation failed:', err);
    process.exit(1);
  });
