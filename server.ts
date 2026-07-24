import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Direct download links for backup & transfer
  app.get('/download-src', (req, res) => {
    const filePath = path.join(process.cwd(), 'src.zip');
    if (fs.existsSync(filePath)) {
      res.download(filePath, 'src.zip');
    } else {
      res.status(404).send('src.zip not found on server. Try refreshing or regenerating.');
    }
  });

  app.get('/download-project', (req, res) => {
    const filePath = path.join(process.cwd(), 'project-files.zip');
    if (fs.existsSync(filePath)) {
      res.download(filePath, 'project-files.zip');
    } else {
      res.status(404).send('project-files.zip not found on server. Try refreshing or regenerating.');
    }
  });

  // Vite middleware for development or fallback for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
