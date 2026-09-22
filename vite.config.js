import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function extractBase64ImagesToFiles(obj, prefix = 'upload') {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      const match = obj.match(/^data:image\/([a-zA-Z0-9+\-]+);base64,(.+)$/);
      if (match) {
        let ext = match[1];
        if (ext === 'jpeg') ext = 'jpg';
        if (ext.includes('svg')) ext = 'svg';
        const buffer = Buffer.from(match[2], 'base64');
        const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const outDir = path.resolve(process.cwd(), 'public/images');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, filename), buffer);
        return `/images/${filename}`;
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item, i) => extractBase64ImagesToFiles(item, `${prefix}_${i}`));
  }
  if (typeof obj === 'object') {
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = extractBase64ImagesToFiles(obj[key], `${prefix}_${key}`);
    }
    return res;
  }
  return obj;
}

export default defineConfig({
  base: './',
  server: {
    watch: {
      ignored: ['**/src/data/initialData.js', '**/public/images/**']
    }
  },
  plugins: [
    react(),
    {
      name: 'auto-save-initial-data',
      configureServer(server) {
        server.middlewares.use('/__api/save-initial-data', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsedData = JSON.parse(body);
                const data = extractBase64ImagesToFiles(parsedData, 'cms');
                const fullData = {
                  deployTimestamp: Date.now(),
                  isAdmin: false,
                  heroConfig: data.heroConfig || {},
                  sponsors: data.sponsors || [],
                  eventInfo: data.eventInfo || {},
                  announcements: data.announcements || [],
                  categories: data.categories || [],
                  carouselItems: data.carouselItems || [],
                  showcaseItems: data.showcaseItems || [],
                  formQuestions: data.formQuestions || [],
                  formResponses: data.formResponses || [],
                  customPages: data.customPages || [],
                  siteBranding: data.siteBranding || {},
                  featureCards: data.featureCards || [],
                  introCards: data.introCards || []
                };
                const fileContent = `export const initialData = ${JSON.stringify(fullData, null, 2)};\n`;
                const filePath = path.resolve(process.cwd(), 'src/data/initialData.js');
                fs.writeFileSync(filePath, fileContent, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error('Error auto saving initialData:', e);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });

        server.middlewares.use('/__api/deploy-firebase', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsedData = JSON.parse(body);
                const data = extractBase64ImagesToFiles(parsedData, 'cms');
                const fullData = {
                  deployTimestamp: Date.now(),
                  isAdmin: false,
                  heroConfig: data.heroConfig || {},
                  sponsors: data.sponsors || [],
                  eventInfo: data.eventInfo || {},
                  announcements: data.announcements || [],
                  categories: data.categories || [],
                  carouselItems: data.carouselItems || [],
                  showcaseItems: data.showcaseItems || [],
                  formQuestions: data.formQuestions || [],
                  formResponses: data.formResponses || [],
                  customPages: data.customPages || [],
                  siteBranding: data.siteBranding || {},
                  featureCards: data.featureCards || [],
                  introCards: data.introCards || []
                };
                const fileContent = `export const initialData = ${JSON.stringify(fullData, null, 2)};\n`;
                const filePath = path.resolve(process.cwd(), 'src/data/initialData.js');
                fs.writeFileSync(filePath, fileContent, 'utf-8');

                console.log('Building dist bundle for Firebase with full images...');
                execSync('npm run build', { cwd: process.cwd(), stdio: 'inherit' });

                console.log('Deploying to Firebase project fox-around...');
                execSync('npx -y firebase-tools deploy --project fox-around', { cwd: process.cwd(), stdio: 'inherit' });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, url: 'https://fox-around.web.app' }));
              } catch (e) {
                console.error('Error deploying to Firebase:', e);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            res.statusCode = 405;
            res.end();
          }
        });
      }
    }
  ]
});
