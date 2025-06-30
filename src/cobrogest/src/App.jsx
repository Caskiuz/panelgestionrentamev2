import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importa las nuevas páginas y componentes de CobroGest
import Overview from './pages/Overview'; // La nueva página de visión general
// Importa tus componentes originales de LandingPage y AuthPage si todavía los necesitas
// aunque ahora el login se centraliza en la app principal.
// import LandingPage from './pages/LandingPage';
// import AuthPage from './pages/AuthPage';

// Nuevas páginas para secciones detalladas
import ClientsPage from './pages/Clients'; // Vamos a crear esta
import DebtsPage from './pages/Debts';     // Vamos a crear esta
import PaymentsPage from './pages/Payments'; // Vamos a crear esta
import ServicesPage from './pages/Services'; // Vamos a crear esta
import SettingsPage from './pages/Settings'; // Vamos a crear esta (si es diferente a la de Dashboard anterior)
import NotasRemisionPage from './pages/NotasRemision'; // Nueva página para Notas de Remisión
import ProductsPage from './pages/Products'; // Nueva página para Productos

// Componente PrivateRoute, ahora solo verifica si hay un token.
// Redirige al login principal si el token no existe.
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  // Si no hay token, redirige a la página de login principal,
  // ya que el login de CobroGest se elimina.
  return token ? children : <Navigate to="/login" replace />;
}

// Componente NotFound para rutas no encontradas dentro de CobroGest
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-center text-5xl font-extrabold text-red-600">
        404 - Página no encontrada (CobroGest)
      </h1>
    </div>
  );
}

// Este componente ahora exporta las rutas internas de CobroGest
export default function CobroGestRoutes() {
  return (
    <Routes>
      {/* Redirigir la raíz de /cobrogest a /cobrogest/dashboard */}
      <Route path="/" element={<Navigate to="/cobrogest/dashboard" replace />} />

      {/* Rutas principales de CobroGest, protegidas */}
      <Route
        path="/dashboard" // Esta ruta será efectiva en /cobrogest/dashboard
        element={
          <PrivateRoute>
            <Overview /> {/* Monta el componente Overview (el nuevo dashboard) */}
          </PrivateRoute>
        }
      />
      <Route
        path="/clients" // /cobrogest/clients
        element={
          <PrivateRoute>
            <ClientsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/debts" // /cobrogest/debts
        element={
          <PrivateRoute>
            <DebtsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payments" // /cobrogest/payments
        element={
          <PrivateRoute>
            <PaymentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/services" // /cobrogest/services
        element={
          <PrivateRoute>
            <ServicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings" // /cobrogest/settings
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notas-remision" // /cobrogest/notas-remision
        element={
          <PrivateRoute>
            <NotasRemisionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/products" // /cobrogest/products
        element={
          <PrivateRoute>
            <ProductsPage />
          </PrivateRoute>
        }
      />

      {/* Manejo de rutas no encontradas dentro de /cobrogest/* */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
