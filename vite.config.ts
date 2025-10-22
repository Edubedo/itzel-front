import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  server: {
    port: 4000, // Puerto del frontend en desarrollo
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend local en desarrollo
        changeOrigin: true,
        secure: false
      },
    },
  },
  preview: {
    port: 4173, // Puerto para preview
    proxy: {
      '/api': {
        target: 'https://itzel-back-production.up.railway.app',  // Backend de producción
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: '/',
  plugins: [
    react(),
   
  ],
  assetsInclude: ["**/*.md", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif"], // Incluye imágenes
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
  }
})
