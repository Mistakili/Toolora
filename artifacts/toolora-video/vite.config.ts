import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const port = Number(process.env.PORT || 5173)
const base = process.env.BASE_PATH || '/toolora-video'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
})
