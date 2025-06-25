import React from 'react';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';

function SettingsPage() {
  const { userData, isLoading } = useAuthAndMetrics();

  if (isLoading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Configuración CobroGest
          </h1>
        </header>
        <section className="bg-white p-6 rounded-xl shadow-inner">
          <p className="text-gray-600">Aquí se ajustarán las configuraciones específicas de CobroGest.</p>
          {/* Contenido futuro para la configuración */}
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="appName">
                Nombre de la Aplicación
              </label>
              <input
                type="text"
                id="appName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="CobroGest Pro"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Guardar Cambios
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default SettingsPage;
