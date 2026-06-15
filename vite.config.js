import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // En GitHub Actions GITHUB_ACTIONS=true → usa el repo como base path
  base: process.env.GITHUB_ACTIONS ? '/video-collector/' : '/',
})
