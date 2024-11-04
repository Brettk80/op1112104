import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist', 'react', 'react-dom']
  },
  build: {
    commonjsOptions: {
      include: [/pdfjs-dist/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion', 'sonner'],
          'pdf-vendor': ['pdfjs-dist']
        }
      }
    },
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
  },
  esbuild: {
    target: 'es2020'
  }
});