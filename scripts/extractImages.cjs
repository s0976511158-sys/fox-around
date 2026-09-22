const fs = require('fs');
const path = require('path');

const initialDataPath = path.join(__dirname, '..', 'src', 'data', 'initialData.js');
const { initialData } = require(initialDataPath);

const outDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let imgCount = 0;

function processObj(obj, namePath = 'img') {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      imgCount++;
      const match = obj.match(/^data:image\/([a-zA-Z0-9+\-]+);base64,(.+)$/);
      if (match) {
        let ext = match[1];
        if (ext === 'jpeg') ext = 'jpg';
        if (ext.includes('svg')) ext = 'svg';
        const buffer = Buffer.from(match[2], 'base64');
        const safeName = namePath.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const filename = `${safeName}_${imgCount}.${ext}`;
        const filePath = path.join(outDir, filename);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        return `/images/${filename}`;
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item, idx) => processObj(item, `${namePath}_${idx}`));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (let k in obj) {
      newObj[k] = processObj(obj[k], `${namePath}_${k}`);
    }
    return newObj;
  }
  return obj;
}

console.log('Extracting Base64 images from initialData.js...');
const cleaned = processObj(initialData, 'site');
console.log(`Successfully extracted ${imgCount} images to public/images/!`);

const newContent = `export const initialData = ${JSON.stringify(cleaned, null, 2)};\n`;
fs.writeFileSync(initialDataPath, newContent, 'utf8');
console.log(`Rewrote initialData.js cleanly. New file size: ${(fs.statSync(initialDataPath).size / 1024).toFixed(2)} KB.`);
