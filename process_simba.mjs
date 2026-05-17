import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = `C:\\Users\\roych\\.gemini\\antigravity\\brain\\6621dc0a-80c9-4a06-ba84-cab353ebf7fc`;
const targetDir = `c:\\Users\\roych\\Downloads\\clean-heights-initiative (1)\\client\\public\\milestones\\simba-oldoldol`;

const files = [
  'media__1774771363728.jpg',
  'media__1774771363875.jpg',
  'media__1774771364018.jpg',
  'media__1774771365410.jpg',
  'media__1774771365450.jpg'
];

async function processImages() {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, `simba-${i + 1}.jpg`);

    console.log(`Processing ${file} -> simba-${i + 1}.jpg`);

    try {
      await sharp(sourcePath)
        // Auto-enhance dullness:
        // 1. Slightly increase brightness (1.1x) and significantly boost saturation (1.4x)
        .modulate({
          brightness: 1.05,
          saturation: 1.35,
        })
        // 2. Increase contrast with linear operation: slope=1.1, intercept=-(128 * 0.1) = -12.8
        .linear(1.15, -19.2) 
        // 3. Mild sharpen
        .sharpen({
          sigma: 1.2,
          m1: 0.5,
          m2: 0.2
        })
        .jpeg({ quality: 90 })
        .toFile(targetPath);
      
      console.log(`Successfully processed: simba-${i + 1}.jpg`);
    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }
}

processImages();
