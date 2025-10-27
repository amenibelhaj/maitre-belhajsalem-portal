import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Expose to Docker and keep same port
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // Allow access from outside container
    port: 5173,           // Ensure same port as exposed
    strictPort: true,     // Prevent Vite from changing port
    watch: {
      usePolling: true,   // Helps Docker detect file changes
    },
  },
})
