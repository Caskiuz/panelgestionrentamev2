import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from '../router/router';
import { RouterProvider } from 'react-router-dom';
import { AuthAndMetricsProvider } from './context/AuthAndMetricsContext'; // ¡NUEVA IMPORTACIÓN!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ¡ENVOLVEMOS TODA LA APLICACIÓN CON EL PROVEEDOR DE CONTEXTO! */}
    <AuthAndMetricsProvider>
      <RouterProvider router={router} />
    </AuthAndMetricsProvider>
  </React.StrictMode>,
);
