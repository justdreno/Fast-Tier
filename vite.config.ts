import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get port from env or use default
  const port = parseInt(env.VITE_PORT) || 5173;
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    server: {
      port: port,
      strictPort: false,
      hmr: {
        overlay: true,
      },
      // Enable SPA routing fallback
      historyApiFallback: true,
    },
    preview: {
      port: port,
      strictPort: false,
    },
  };
});
