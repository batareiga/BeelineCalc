import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/BeelineCalc/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
