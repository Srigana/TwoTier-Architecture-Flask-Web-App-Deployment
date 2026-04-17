import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/messages': 'http://localhost:5000',
      '/submit': 'http://localhost:5000',
    }
  }
})
 
