import { defineConfig, loadEnv } from 'vite';
import { default as react } from '@vitejs/plugin-react-swc';
import { join } from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
          target: env.BACKEND_URL,
        },
      },
    },
    plugins: [
      VitePWA({
        manifestFilename: 'manifest.json',
        registerType: 'autoUpdate',
        minify: true,
        workbox: {
          sourcemap: true,
        },
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: 'IoT Inhaler Alert System',
          short_name: 'IoT Inhaler',
          description: 'Capstone project',
          theme_color: '#ffffff',
          orientation: 'portrait',
          icons: [
            {
              src: 'assets/image/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'assets/image/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      react(),
    ],
    resolve: {
      alias: {
        '@': join(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
    },
  };
});
