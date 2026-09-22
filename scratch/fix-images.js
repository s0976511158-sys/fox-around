import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/initialData.js');
let content = fs.readFileSync(filePath, 'utf-8');

const countBefore = (content.match(/\/images\//g) || []).length;
console.log('Found /images/ count:', countBefore);

// Replace all "/images/ with "./images/
content = content.replace(/"\/images\//g, '"./images/');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully updated initialData.js to use relative ./images/ paths!');
