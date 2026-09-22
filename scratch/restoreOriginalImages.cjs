const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const initialDataPath = path.join(__dirname, '../src/data/initialData.js');

let content = fs.readFileSync(initialDataPath, 'utf8');

// Function to map a .webp file path to its original .png / .jpg / .gif file if it exists
function replaceWebpWithOriginal(match, relativePath) {
  const filename = path.basename(relativePath);
  if (!filename.endsWith('.webp')) return match;

  const baseNameNoExt = filename.slice(0, -5); // remove .webp

  // Check if .gif, .png, or .jpg exists in public/images
  const possibleExts = ['.gif', '.png', '.jpg', '.jpeg'];
  for (const ext of possibleExts) {
    const candidateFilename = baseNameNoExt + ext;
    const candidatePath = path.join(imagesDir, candidateFilename);
    if (fs.existsSync(candidatePath)) {
      console.log(`Restoring ${filename} -> ${candidateFilename}`);
      return relativePath.replace(filename, candidateFilename);
    }
  }

  // Also check if there is an original name before timestamp like cms_carouselItems_0_gifUrl_...
  return relativePath;
}

// Replace all "./images/....webp" strings in initialData.js
const updatedContent = content.replace(/["'](\.\/images\/[^"']+\.webp)["']/g, (fullMatch, imgPath) => {
  const restored = replaceWebpWithOriginal(fullMatch, imgPath);
  return `"${restored}"`;
});

fs.writeFileSync(initialDataPath, updatedContent, 'utf8');
console.log('Finished updating initialData.js');
