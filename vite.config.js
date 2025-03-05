import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
  optimizeDeps: {
    include: ['swiper', 'swiper/modules'],
  },
  resolve: {
    alias: {
      '/node_modules': resolve(__dirname, './node_modules'),
    },
  },
});
