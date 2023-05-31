// pathname: /vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: '0.0.0.0', // It will be accessible from the network
  },
  base: '/anc-greens-vite/', // add this line
  build: {
    outDir: 'dist'
  },
})
