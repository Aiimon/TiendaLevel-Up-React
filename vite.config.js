import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js"
  },
  server: {
    proxy: {
      // Todo lo que empiece con /v1 o /v2 se redirige al backend
      '/v1': 'http://localhost:8082',
      '/v2': 'http://localhost:8082',
    }
  }
})
