import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    proxy: {
      '/elevation-tiles': {
        target: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/elevation-tiles/, ''),
      }
    }
  }
})
