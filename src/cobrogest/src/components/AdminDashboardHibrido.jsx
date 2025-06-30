import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NOTIFICACIONES = [
  { key: 'deudas', label: 'Deudas por cobrar hoy/atrasadas' },
  { key: 'pagos_servicios', label: 'Pagos de servicios hoy/atrasados' },
  { key: 'nuevos_clientes', label: 'Nuevos clientes registrados' },
  { key: 'bajo_stock', label: 'Productos con bajo stock' },
  { key: 'contratos_vencer', label: 'Contratos próximos a vencer' },
  { key: 'resumen', label: 'Resumen semanal/mensual de movimientos' },
];

export default function AdminDashboardHibrido() {
  // Métricas
  const [metrics, setMetrics] = useState({
    cobrosHoy: 'Cargando...',
    pagosServiciosHoy: 'Cargando...',
    cobrosAtrasados: 'Cargando...',
    serviciosAtrasados: 'Cargando...'
  });
  // Simulación notificaciones
  const [notificaciones, setNotificaciones] = useState({
    deudas: true,
    pagos_servicios: true,
    nuevos_clientes: false,
    bajo_stock: false,
    contratos_vencer: false,
    resumen: false
  });
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Ejemplo de endpoints públicos, ajustar según backend real
    async function fetchMetrics() {
      try {
        // Simulación: puedes cambiar las URLs por las reales si existen
        // const cobrosHoy = await axios.get('URL_COBROS_HOY');
        // ...
        setMetrics({
          cobrosHoy: 0, // Reemplazar por cobrosHoy.data.total
          pagosServiciosHoy: 0, // ...
          cobrosAtrasados: 0, // ...
          serviciosAtrasados: 0 // ...
        });
      } catch (e) {
        setMetrics({
          cobrosHoy: 'No disponible',
          pagosServiciosHoy: 'No disponible',
          cobrosAtrasados: 'No disponible',
          serviciosAtrasados: 'No disponible'
        });
      }
    }
    fetchMetrics();
  }, []);

  function handleCheckbox(key) {
    setNotificaciones({ ...notificaciones, [key]: !notificaciones[key] });
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border-b-4 border-[#C70000]">
      <h2 className="text-2xl font-bold text-[#0D6EFD] mb-4">Panel de Métricas y Notificaciones</h2>
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-lg font-semibold text-blue-900">Cobros para Hoy</span>
          <span className="text-3xl font-bold text-[#C70000]">{metrics.cobrosHoy}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-lg font-semibold text-blue-900">Pagos de Servicios para Hoy</span>
          <span className="text-3xl font-bold text-[#C70000]">{metrics.pagosServiciosHoy}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-lg font-semibold text-blue-900">Cobros Atrasados</span>
          <span className="text-3xl font-bold text-[#C70000]">{metrics.cobrosAtrasados}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow flex flex-col items-center">
          <span className="text-lg font-semibold text-blue-900">Servicios Atrasados</span>
          <span className="text-3xl font-bold text-[#C70000]">{metrics.serviciosAtrasados}</span>
        </div>
      </div>
      {/* Configuración de notificaciones */}
      <div className="bg-gray-50 p-6 rounded-lg shadow mb-4">
        <h3 className="text-xl font-semibold text-blue-900 mb-2">Configuración de Notificaciones (Simulación)</h3>
        <p className="text-sm text-gray-600 mb-4">Esta funcionalidad es solo visual. El envío real de emails requiere acceso completo al backend.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {NOTIFICACIONES.map(n => (
            <label key={n.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificaciones[n.key]}
                onChange={() => handleCheckbox(n.key)}
                disabled
              />
              <span>{n.label}</span>
            </label>
          ))}
        </div>
        <div className="mb-2">
          <label className="block text-blue-900 font-semibold mb-1">Email de notificaciones</label>
          <input
            type="email"
            className="form-input border border-blue-200 rounded-lg px-3 py-2 w-full"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div className="text-xs text-red-600 mt-2">
          <b>Nota:</b> La configuración y envío de notificaciones por email no está disponible en este entorno por falta de permisos de backend.
        </div>
      </div>
    </div>
  );
}
