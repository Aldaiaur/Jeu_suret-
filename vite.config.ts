import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // La carte du monde (Natural Earth) est embarquée : un gros fichier est normal pour un jeu de bureau
  build: { chunkSizeWarningLimit: 2500 },
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 60000
  }
});
