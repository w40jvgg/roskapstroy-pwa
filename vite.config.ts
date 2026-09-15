import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/roskapstroy-pwa/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'РосКапСтрой — Строительный контроль',
        short_name: 'РосКапСтрой',
        description: 'Офлайн-инструмент инженера строительного контроля',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '.',
        scope: '.',
        background_color: '#EFF2F5',
        theme_color: '#071F3D',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false
      }
    })
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'], database: ['dexie'], archive: ['fflate'], icons: ['lucide-react'] } } }
  }
}));
