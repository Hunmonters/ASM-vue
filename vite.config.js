import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4000', // đúng cổng JSON Server ở Bước 1
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        hmr: { overlay: true } // hoặc false nếu overlay làm bạn bấm nút không được
    }
})