import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ya no necesitamos configuraciones específicas de 'cobrogest' aquí,
  // ya que su código se integrará directamente en el proceso de build del proyecto principal.
})
