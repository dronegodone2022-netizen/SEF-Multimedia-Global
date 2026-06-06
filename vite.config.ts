import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) return undefined;
              const directories = id.split('node_modules/').slice(1);
              if (directories.length === 0) return 'vendor';
              const pkgPath = directories[0];
              const pkgName = pkgPath.startsWith('@')
                ? pkgPath.split('/').slice(0, 2).join('/')
                : pkgPath.split('/')[0];
              return pkgName.replace('@', '').replace('/', '-');
            }
          }
        }
      }
    };
});