/**
 * Image optimization script — converts large PNG images in /public to WebP
 * Targets LCP improvement by reducing image download size
 * Run with: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Images to optimize and their quality settings
const imageTargets = [
  { file: 'hero-solar.png', quality: 82, maxWidth: 1400 },
  { file: 'office.png', quality: 80, maxWidth: 1200 },
  { file: 'panels_tech.png', quality: 82, maxWidth: 1200 },
  { file: 'standards_tech.png', quality: 82, maxWidth: 1200 },
  { file: 'structure_tech.png', quality: 82, maxWidth: 1200 },
  { file: 'residential_hero.png', quality: 82, maxWidth: 1200 },
  { file: 'commercial_hero.png', quality: 82, maxWidth: 1200 },
  { file: 'society_hero.png', quality: 82, maxWidth: 1200 },
  { file: 'farmers_hero.png', quality: 82, maxWidth: 1200 },
  { file: 'map_hayathnagar.png', quality: 75, maxWidth: 900 },
  { file: 'map_hyderabad.png', quality: 75, maxWidth: 900 },
  { file: 'map_office.png', quality: 75, maxWidth: 900 },
  { file: 'map_telangana.png', quality: 75, maxWidth: 900 },
  { file: 'logo.png', quality: 90, maxWidth: 400 },
  { file: 'logo.jpg', quality: 88, maxWidth: 400 },
];

async function getFileSizeKB(filePath) {
  try {
    const s = await stat(filePath);
    return Math.round(s.size / 1024);
  } catch {
    return 0;
  }
}

async function optimizeImages() {
  console.log('🌞 MyHome Solar — Image Optimizer\n');
  
  let totalBefore = 0;
  let totalAfter = 0;

  for (const { file, quality, maxWidth } of imageTargets) {
    const inputPath = join(publicDir, file);
    const ext = extname(file);
    const name = basename(file, ext);
    const outputPath = join(publicDir, `${name}.webp`);

    try {
      const beforeKB = await getFileSizeKB(inputPath);
      if (beforeKB === 0) {
        console.log(`⚠️  Skipping ${file} — file not found`);
        continue;
      }

      await sharp(inputPath)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toFile(outputPath);

      const afterKB = await getFileSizeKB(outputPath);
      const saved = Math.round((1 - afterKB / beforeKB) * 100);
      totalBefore += beforeKB;
      totalAfter += afterKB;

      console.log(`✅  ${file.padEnd(28)} ${beforeKB} KB → ${afterKB} KB  (${saved}% smaller)`);
    } catch (err) {
      console.error(`❌  Error processing ${file}:`, err.message);
    }
  }

  const totalSaved = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(`\n📊 Total: ${totalBefore} KB → ${totalAfter} KB (${totalSaved}% reduction, saved ${totalBefore - totalAfter} KB)`);
  console.log('\n✨ Done! Update your component <img src=""> to use .webp versions.\n');
}

optimizeImages();
