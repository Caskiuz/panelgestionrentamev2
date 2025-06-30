import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_RENTAS = 'https://backrecordatoriorenta-production.up.railway.app/api/rentas';
const API_SERVICIOS = 'https://backrecordatoriorenta-production.up.railway.app/api/servicios';

export default function DepuracionDeudasServicios() {
  const [deudas, setDeudas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
        const { data: rentasData } = await axios.get(`${API_RENTAS}/`, axiosConfig);
        const { data: serviciosData } = await axios.get(`${API_SERVICIOS}/`, axiosConfig);
        setDeudas((rentasData.response || []).filter(d => d.estado_renta !== 'Pagada'));
        setServicios((serviciosData.response || []).filter(s => !s.pagado));
      } catch (e) {
        setError('No se pudo obtener la información.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Cargando deudas y servicios...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Deudas no pagadas</h3>
      <table className="min-w-full text-xs md:text-sm border mb-6">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-2 py-1">Cliente</th>
            <th className="px-2 py-1">Teléfono</th>
            <th className="px-2 py-1">Dirección</th>
            <th className="px-2 py-1">Fecha Vencimiento</th>
            <th className="px-2 py-1">Monto</th>
            <th className="px-2 py-1">Estado</th>
          </tr>
        </thead>
        <tbody>
          {deudas.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-2">Sin deudas pendientes</td></tr>
          ) : (
            deudas.map((d, i) => (
              <tr key={d._id || i} className="border-b">
                <td className="px-2 py-1">{d.nombre}</td>
                <td className="px-2 py-1">{d.telefono}</td>
                <td className="px-2 py-1">{d.direccion}</td>
                <td className="px-2 py-1">{d.fecha_vencimiento}</td>
                <td className="px-2 py-1">${parseFloat(d.total_renta || 0).toFixed(2)}</td>
                <td className="px-2 py-1">{d.estado_renta}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mb-2">Servicios no pagados</h3>
      <table className="min-w-full text-xs md:text-sm border">
        <thead>
          <tr className="bg-purple-100">
            <th className="px-2 py-1">Servicio</th>
            <th className="px-2 py-1">Fecha Vencimiento</th>
            <th className="px-2 py-1">Monto</th>
            <th className="px-2 py-1">Pagado</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length === 0 ? (
            <tr><td colSpan={4} className="text-center py-2">Sin servicios pendientes</td></tr>
          ) : (
            servicios.map((s, i) => (
              <tr key={s._id || i} className="border-b">
                <td className="px-2 py-1">{s.nombre}</td>
                <td className="px-2 py-1">{s.fechaVencimiento}</td>
                <td className="px-2 py-1">${parseFloat(s.precio || 0).toFixed(2)}</td>
                <td className="px-2 py-1">{s.pagado ? 'Sí' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
