import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Cambia al puerto correcto de tu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Opcional, aquí mantiene /api
        secure: false, // Útil si usas HTTPS con certificado autofirmado
        ws: true,      // Proxy para WebSocket si usas
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`Proxying request ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`Received response ${proxyRes.statusCode} for ${req.url}`);
          });
        },
      },
    },
  },
});
