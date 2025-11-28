import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // GitHub Pages部署配置
  // 如果部署到 https://<USERNAME>.github.io/<REPO>/，则设置为 '/<REPO>/'
  // 如果部署到 https://<USERNAME>.github.io/，则设置为 '/'
  base: process.env.NODE_ENV === 'production' ? '/campus-food-safety/' : '/',
})
