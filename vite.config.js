import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/moralis': {
        target: 'https://8qqup4wcrb.execute-api.ca-central-1.amazonaws.com/test/forward/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/moralis/, '')
      }
    }
  },
  build: {
    
  }
})
