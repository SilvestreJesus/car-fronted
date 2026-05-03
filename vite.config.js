import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Esto te permite usar '@' para referirte a la carpeta 'src' 
      // (ej. import api from '@/api')
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Asegura que los archivos se generen en la carpeta que Vercel espera
    outDir: 'dist',
  }
})