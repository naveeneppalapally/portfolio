const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  console.error('out/ directory not found. Run next build first.');
  process.exit(1);
}

// Find all HTML files in the out directory
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (filePath.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(outDir);
console.log(`Found ${htmlFiles.length} HTML files...`);
console.log('Skipping async stylesheet conversion to protect Mobile LCP and TBT metrics.');
