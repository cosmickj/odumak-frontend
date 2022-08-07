import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  plugins: [
    vue(),
    VitePWA({
      base: '/',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: ['/favicon.ico'],
      strategies: 'generateSW',
      injectRegister: 'script',
      registerType: 'autoUpdate',
      workbox: {
        sourcemap: true,
      },
      manifest: {
        lang: 'kr',
        name: '오두막',
        short_name: '오두막',
        description: '영은교회 초등부 출석부',
        theme_color: '#f1f5f9',
        background_color: '#f1f5f9',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    host: true,
    port: 8080,
  },
});
