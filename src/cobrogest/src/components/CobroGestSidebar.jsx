import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, DollarSign, CreditCard, Settings, LogOut, LayoutDashboard, ArrowLeftSquare, Box, FileText } from 'lucide-react';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';

function CobroGestSidebar() {
  const [open, setOpen] = useState(false); // Estado para sidebar móvil
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

  // Botón hamburguesa solo visible en móvil
  const Hamburger = () => (
    <button
      className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 bg-opacity-80 p-2 rounded-lg shadow-lg"
      onClick={() => setOpen(true)}
      aria-label="Abrir menú"
    >
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );

  // Overlay para cerrar el sidebar en móvil
  const Overlay = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
      onClick={() => setOpen(false)}
      aria-label="Cerrar menú"
    />
  );

  if (isLoading || !userData) {
    return (
      <>
        <Hamburger />
        <aside className="w-64 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 flex flex-col justify-center items-center shadow-lg rounded-r-xl hidden md:flex">
          Cargando usuario...
        </aside>
      </>
    );
  }

  return (
    <>
      <Hamburger />
      {open && <Overlay />}
      <aside
        className={`fixed md:static top-0 left-0 z-50 md:z-10 h-full md:h-auto w-64 bg-gradient-to-br from-[#C70000] to-[#0D6EFD] text-white p-6 flex flex-col justify-between shadow-2xl rounded-r-xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex md:flex-col md:justify-between`}
        style={{ minHeight: '100vh', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)' }}
        tabIndex={-1}
        aria-label="Menú lateral"
      >
        <button
          className="md:hidden absolute top-4 right-4 text-white bg-gray-800 bg-opacity-80 p-2 rounded-lg z-50 hover:bg-red-700 transition"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-200">
          <div className="text-3xl font-extrabold text-white mb-10 flex items-center justify-center">
            <DollarSign className="w-8 h-8 mr-2 text-green-400" />
            CobroGest Pro
          </div>
          {/* Sección: Panel y Finanzas */}
          <div className="mb-6">
            <div className="text-xs uppercase text-gray-400 font-bold mb-2 pl-2">Panel</div>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link to="/cobrogest/dashboard"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/dashboard') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Visión General
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Sección: Gestión */}
          <div className="mb-6">
            <div className="text-xs uppercase text-gray-400 font-bold mb-2 pl-2">Gestión</div>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link to="/cobrogest/clients"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/clients') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Clientes
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/cobrogest/products"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/products') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <Box className="w-5 h-5 mr-3" />
                    Productos
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/cobrogest/debts"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/debts') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <DollarSign className="w-5 h-5 mr-3" />
                    Deudas por Cobrar
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/cobrogest/payments"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/payments') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Pagos Recibidos
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/cobrogest/services"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/services') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Servicios a Pagar
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/cobrogest/notas-remision"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/notas-remision') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    Notas de Remisión
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Sección: Configuración */}
          <div className="mb-6">
            <div className="text-xs uppercase text-gray-400 font-bold mb-2 pl-2">Configuración</div>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link to="/cobrogest/settings"
                    className={`flex items-center w-full p-3 rounded-lg transition duration-200 ease-in-out ${location.pathname.startsWith('/cobrogest/settings') ? 'bg-red-600 shadow-md text-white' : 'bg-gray-800 hover:bg-red-700 hover:text-white text-gray-300'}`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Configuración
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/* Sección de usuario y logout en la barra lateral */}
        <div className="mt-8 pt-4 border-t border-gray-700 flex-shrink-0">
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
          <button
            onClick={goToMainApp}
            className="flex items-center w-full p-3 rounded-lg text-gray-300 bg-gray-800 hover:bg-blue-600 hover:text-white transition duration-200 ease-in-out mb-2"
          >
            <ArrowLeftSquare className="w-5 h-5 mr-3" />
            Ir a Principal
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-gray-300 bg-gray-800 hover:bg-red-700 hover:text-white transition duration-200 ease-in-out"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default CobroGestSidebar;