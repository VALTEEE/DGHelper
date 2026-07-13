import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/bag': 'http://localhost:3000',
      '/profile': 'http://localhost:3000',
    },
  },
})