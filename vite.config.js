import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy all /api/* requests to the Express backend during local dev
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
})

