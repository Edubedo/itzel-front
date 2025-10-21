import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  build: {
    outDir: "dist", // Carpeta de salida (por defecto Vite ya la usa)
    emptyOutDir: true, // Limpia la carpeta antes del build
  },
  base: "./", // ✅ Esto asegura que las rutas funcionen correctamente en Vercel
});
