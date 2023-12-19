import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { join } from 'node:path';

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
    plugins: [react()],
    resolve: {
      alias: {
        '@': join(__dirname, './src'),
      },
    },
  };
});
