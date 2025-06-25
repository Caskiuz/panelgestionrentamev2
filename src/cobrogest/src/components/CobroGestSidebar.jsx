import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, DollarSign, CreditCard, Settings, LogOut, LayoutDashboard, ArrowLeftSquare } from 'lucide-react';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext'; // Ruta corregida

function CobroGestSidebar() {
  const location = useLocation();
  const { userData, isLoading } = useAuthAndMetrics();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = `${window.location.origin}/login`;
  };

  const goToMainApp = () => {
    window.location.href = `${window.location.origin}/Homepage`;
  };

  if (isLoading || !userData) {
    return (
      <aside className="w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 flex flex-col justify-center items-center shadow-lg rounded-r-xl">
        Cargando usuario...
      </aside>
    );
  }

  return (
    // La barra lateral principal, ahora con flex-col y justify-between para empujar el footer abajo
    <aside className="w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 flex flex-col justify-between shadow-lg rounded-r-xl">
      {/* Contenido superior: Título y Navegación (con scroll si es necesario) */}
      <div className="flex-grow overflow-y-auto"> {/* flex-grow para ocupar espacio, overflow-y-auto para scroll */}
        {/* Título de la aplicación CobroGest */}
        <div className="text-3xl font-extrabold text-white mb-10 flex items-center justify-center">
          <DollarSign className="w-8 h-8 mr-2 text-green-400" />
          CobroGest Pro
        </div>
        <nav>
          <ul>
            {/* Enlace a Visión General (Overview) */}
            <li className="mb-4">
              <Link to="/cobrogest/dashboard"
                className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${
                  location.pathname.startsWith('/cobrogest/dashboard') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Visión General
              </Link>
            </li>
            {/* Enlace a Clientes (nueva página) */}
            <li className="mb-4">
              <Link to="/cobrogest/clients"
                className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${
                  location.pathname.startsWith('/cobrogest/clients') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Clientes
              </Link>
            </li>
            {/* Enlace a Deudas (nueva página) */}
            <li className="mb-4">
              <Link to="/cobrogest/debts"
                className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${
                  location.pathname.startsWith('/cobrogest/debts') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'
                }`}
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Deudas por Cobrar
              </Link>
            </li>
            {/* Enlace a Pagos Recibidos (nueva página) */}
            <li className="mb-4">
              <Link to="/cobrogest/payments"
                className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${
                  location.pathname.startsWith('/cobrogest/payments') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Pagos Recibidos
              </Link>
            </li>
            {/* Enlace a Servicios (nueva página para gastos/pagos propios) */}
            <li className="mb-4">
              <Link to="/cobrogest/services"
                className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${
                  location.pathname.startsWith('/cobrogest/services') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" /> {/* Usando Settings, puedes elegir otro */}
                Mis Servicios a Pagar
              </Link>
            </li>
            {/* Enlace a Configuración de CobroGest */}
            <li className="mb-4">
              <Link to="/cobrogest/settings"
                className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${
                  location.pathname.startsWith('/cobrogest/settings') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Configuración CobroGest
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sección de usuario y logout en la barra lateral (Ahora en un contenedor fijo en la parte inferior) */}
      <div className="mt-8 pt-4 border-t border-gray-700 flex-shrink-0"> {/* flex-shrink-0 para que no se encoja */}
        <div className="flex items-center mb-4">
          {userData.foto ? (
            <img className='w-10 h-10 rounded-full mr-3' src={userData.foto} alt="Foto de perfil"/>
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
              {userData.nombre?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-gray-100 font-medium">{userData.nombre || 'Usuario'}</span>
        </div>
        {/* Botón para regresar a la aplicación principal */}
        <button
          onClick={goToMainApp}
          className="flex items-center w-full p-3 rounded-lg text-gray-300 bg-gray-800 hover:bg-blue-600 hover:text-white transition duration-200 ease-in-out mb-2"
        >
          <ArrowLeftSquare className="w-5 h-5 mr-3" />
          Ir a Principal
        </button>
        {/* Botón de Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-300 bg-gray-800 hover:bg-red-700 hover:text-white transition duration-200 ease-in-out"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

export default CobroGestSidebar;
