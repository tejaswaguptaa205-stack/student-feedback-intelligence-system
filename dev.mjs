import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

async function startServer() {
  const server = await createServer({
    configFile: false,
    root: process.cwd(),
    plugins: [react()],
    server: {
      port: 5173,
      host: '0.0.0.0'
    }
  });

  await server.listen();
  console.log('------------------------------------------------------------');
  console.log(' SFIS (Student Feedback Intelligence System) Dev Server Live:');
  console.log(' Local URL:    http://localhost:5173/');
  console.log(' Network URL:  http://127.0.0.1:5173/');
  console.log('------------------------------------------------------------');
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
