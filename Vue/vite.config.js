import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  preview: {
    port: 3030
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    devServer: {
      // 代理服务器可以将路由中的指定前缀转发到指定的后端服务器中
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          ws: true, // 是否启用websockets
          changeOrigin: true,  // 代理时是否更改host
          pathRewrite: {
            '^/api': '' //这里理解成用'/api'代替target里面的地址
          }
        }
      }
    }
  },
  base:'./'
})
