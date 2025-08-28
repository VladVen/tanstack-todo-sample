import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default ({ mode }: UserConfig) => {
  process.env = { ...process.env, ...loadEnv(mode as string, process.cwd()) };

  return defineConfig({
    server: {
      open: true,
      port: 3043,
      proxy: {
        '/rest/v1': {
          target: process.env.VITE_SUPABASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/rest\/v1/, ''),
          configure: proxy => {
            proxy.on('error', err => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_, req) => {
              console.log(
                'Sending Request to the Target:',
                req.method,
                req.url,
              );
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(
                'Received Response from the Target:',
                proxyRes.statusCode,
                req.url,
              );
            });
          },
        },
      },
    },
    plugins: [
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react(),
      tailwindcss(),
    ],
    base: '/tanstack-todo-sample/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });
};
