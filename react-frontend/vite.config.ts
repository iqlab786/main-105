import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/db': 'http://localhost:8000',
      '/ingest': 'http://localhost:8000',
      '/metadata': 'http://localhost:8000'
    }
  }
})