import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The Pages workflow sets BASE_PATH to /<repo-name>/; local dev and other hosts serve from the root.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
})
