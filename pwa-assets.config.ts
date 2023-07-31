import { defineConfig, Preset } from '@vite-pwa/assets-generator/config';

export const preset: Preset = {
  transparent: {
    sizes: [64, 192, 512],
    favicons: [[64, 'favicon.ico']],
  },
  maskable: {
    sizes: [512],
    padding: 0.2,
  },
  apple: {
    sizes: [180],
    padding: 0.2,
  },
  png: {
    compressionLevel: 9,
    quality: 85,
  },
};

export default defineConfig({ preset, images: ['public/logo.svg'] });
