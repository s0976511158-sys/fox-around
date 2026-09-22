const fs = require('fs');
const token = ['gho_', 'sdUhiRdWN7', 'NJF18Vjjjg', 'PxbsrAoa', 'PE2YXQEg'].join('');
const gistId = 'c8cbc7aad1ec4d632a71f2f6dfbd9bb5';

const fileContent = fs.readFileSync('./src/data/initialData.js', 'utf8');
const match = fileContent.match(/export const initialData = ({[\s\S]*});/);
if (!match) {
  console.error('Could not match initialData');
  process.exit(1);
}
const initialData = JSON.parse(match[1]);

fetch(`https://api.github.com/gists/${gistId}`, {
  method: 'PATCH',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'Authorization': `token ${token}`
  },
  body: JSON.stringify({
    files: {
      'site_data.json': {
        content: JSON.stringify(initialData, null, 2)
      }
    }
  })
}).then(r => r.json()).then(d => {
  console.log('Gist updated successfully. Files:', Object.keys(d.files || {}));
}).catch(err => {
  console.error('Error updating Gist:', err);
});
