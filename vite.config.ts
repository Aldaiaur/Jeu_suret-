import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // L'accueil est un petit morceau ; l'écran de jeu (carte Natural Earth, milsymbol) est chargé à part
  build: { chunkSizeWarningLimit: 1000 },
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 60000
  }
});
