import { build } from 'vite';
import react from '@vitejs/plugin-react';

async function runBuild() {
  console.log('Building Student Feedback Intelligence System (SFIS)...');
  try {
    await build({
      configFile: false,
      root: process.cwd(),
      plugins: [react()],
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1200
      }
    });
    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

runBuild();
