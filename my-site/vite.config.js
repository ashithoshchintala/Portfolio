import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // This is the line that was failing
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This activates the Tailwind engine
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})