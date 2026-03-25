import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/r-homework-week2/', // 設定為你的倉庫名稱
  plugins: [react()],
  server: {
    open: true,
  },
})
