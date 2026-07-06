import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/smart-student-portal/',
  server: {
    // Redirect bare paths (e.g. /login) to the base path automatically
    middlewareMode: false,
    historyApiFallback: {
      rewrites: [
        // Redirect any path NOT starting with /smart-student-portal to the base
        { from: /^(?!\/smart-student-portal).*$/, to: '/smart-student-portal/' }
      ]
    }
  }
})
