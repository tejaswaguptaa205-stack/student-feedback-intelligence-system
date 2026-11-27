import http from 'http';
import fs from 'fs';
import path from 'path';
import { initializeDatabase } from './server/db.mjs';
import { handleApiRequest } from './server/api.mjs';

const PORT = 5173;
const DIST_DIR = path.resolve('dist');

// Initialize SQLite database and seeds on server start
initializeDatabase();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  // Check if API route
  if (req.url.startsWith('/api/')) {
    await handleApiRequest(req, res);
    return;
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  // If path doesn't exist, fallback to index.html for SPA client-side routing
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Server Internal Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('------------------------------------------------------------');
  console.log(` SFIS Enterprise Platform Server Running at:`);
  console.log(` Local:   http://localhost:${PORT}/`);
  console.log(` Network: http://127.0.0.1:${PORT}/`);
  console.log(` SQLite Database: Connected (sfis.db)`);
  console.log('------------------------------------------------------------');
});
