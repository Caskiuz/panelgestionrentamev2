import React, { useState, useRef } from 'react';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { Download, Upload, Trash2, Info, Save, Image as ImageIcon } from 'lucide-react';
import AdminDashboardHibrido from '../components/AdminDashboardHibrido';
import DepuracionDeudasServicios from '../components/DepuracionDeudasServicios';

function SettingsPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [appName, setAppName] = useState(localStorage.getItem('cobrogest_app_name') || 'CobroGest Pro');
  const [logo, setLogo] = useState(localStorage.getItem('cobrogest_logo') || '');
  const [errorMsg, setErrorMsg] = useState("");

  // Información del sistema
  const version = '1.0.0';
  const lastUpdate = '29/06/2025';

  // Personalización visual
  const handleAppNameChange = (e) => setAppName(e.target.value);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target.result);
        localStorage.setItem('cobrogest_logo', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSavePersonalization = (e) => {
    e.preventDefault();
    localStorage.setItem('cobrogest_app_name', appName);
    setErrorMsg('Personalización guardada.');
  };

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
        <section className="bg-white p-6 rounded-xl shadow-inner mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-blue-500" /> Personalización Visual</h2>
          {errorMsg && <div className="mb-4 text-green-600 font-semibold text-sm">{errorMsg}</div>}
          <form className="space-y-4" onSubmit={handleSavePersonalization}>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="appName">
                Nombre de la Aplicación
              </label>
              <input
                type="text"
                id="appName"
                value={appName}
                onChange={handleAppNameChange}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="logo">
                Logo de la Aplicación (opcional)
              </label>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logo && <img src={logo} alt="Logo" className="mt-2 h-16 object-contain" />}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2 w-full md:w-auto"
            >
              <Save className="w-5 h-5" /> Guardar Cambios
            </button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-inner mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Info className="w-6 h-6 text-gray-500" /> Información del Sistema</h2>
          <ul className="text-gray-700 space-y-2 text-sm md:text-base">
            <li><b>Versión:</b> {version}</li>
            <li><b>Última actualización:</b> {lastUpdate}</li>
            <li><b>Usuario actual:</b> {userData?.email || 'Administrador'}</li>
          </ul>
        </section>

        {/* Panel híbrido de métricas y notificaciones */}
        <section className="bg-white p-6 rounded-xl shadow-inner mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">Panel de Métricas y Notificaciones</h2>
          <div className="my-4">
            <AdminDashboardHibrido />
          </div>
        </section>

        {/* Tabla de depuración: deudas y servicios no pagados */}
        <section className="bg-white p-6 rounded-xl shadow-inner mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Deudas y Servicios No Pagados (Depuración)</h2>
          <DepuracionDeudasServicios />
        </section>
      </main>
    </div>
  );
}

export default SettingsPage;
