import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/sabores_parana/' : '/',
  plugins: [react()],
});
