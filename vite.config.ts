import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto', // control how to register the service worker in application
      manifest: {
        name: '모두의 출석부 | 오두막',
        short_name: '오두막',
        description:
          '오두막 출석부를 통해 아이들의 성장과 교육에 보다 적극적으로 참여하고 지원할 수 있습니다',
        theme_color: '#f2dfd8',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    port: 8080,
  },
});
