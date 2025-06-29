import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import router from '../router/router';
import { RouterProvider } from 'react-router-dom';
import { AuthAndMetricsProvider } from './context/AuthAndMetricsContext';

// Nuevo componente para envolver solo rutas protegidas
function AppWrapper() {
  // Detectar si estamos en la ruta de login
  const isLoginRoute = window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#';
  if (isLoginRoute) {
    // Solo login, sin provider
    return <RouterProvider router={router} />;
  }
  // Rutas protegidas, con provider
  return (
    <AuthAndMetricsProvider>
      <RouterProvider router={router} />
    </AuthAndMetricsProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
);
