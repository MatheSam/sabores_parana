import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/sabores_parana/',
  plugins: [react()],
});
