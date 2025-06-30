import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { CheckCircle } from 'lucide-react';

const API_RENTAS = 'https://backrecordatoriorenta-production.up.railway.app/api/rentas';
const API_CLIENTES = 'https://backrecordatoriorenta-production.up.railway.app/api/clients';

function PaymentsPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [pagos, setPagos] = useState([]); // rentas pagadas
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtener token
  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Cargar rentas pagadas
  const fetchPagos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axios.get(`${API_RENTAS}/`, axiosConfig);
      setPagos((data.response || []).filter(r => r.estado_renta === 'Pagada'));
    } catch (e) {
      setPagos([]);
      setErrorMsg(e?.response?.data?.message || 'Error al cargar pagos');
    }
    setLoading(false);
  };

  // Cargar clientes
  const fetchClientes = async () => {
    try {
      const { data } = await axios.get(`${API_CLIENTES}`, axiosConfig); // <--- sin barra final
      setClientes(data.response || []);
    } catch (e) {
      setClientes([]);
      setErrorMsg(e?.response?.data?.message || 'Error al cargar clientes');
    }
  };

  useEffect(() => {
    fetchPagos();
    fetchClientes();
    // eslint-disable-next-line
  }, []);

  // Marcar renta como pagada
  const handleMarcarPagada = async (rentaId) => {
    if (!window.confirm('¿Marcar esta renta como pagada?')) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await axios.put(`${API_RENTAS}/update/${rentaId}`, { estado_renta: 'Pagada' }, axiosConfig);
      fetchPagos();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al marcar como pagada');
    }
    setLoading(false);
  };

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#C70000] to-[#0D6EFD] font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-2 md:p-8 overflow-y-auto bg-gray-100 min-h-screen md:ml-0 md:pl-64 transition-all duration-300">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Pagos Recibidos (Rentas Pagadas)
          </h1>
        </header>
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Pagos</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {pagos.length === 0 && !loading ? (
            <p className="text-gray-600 text-center py-8">No hay pagos registrados.</p>
          ) : loading ? (
            <div className="text-center py-8 text-blue-600 font-semibold">Cargando pagos...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[800px] w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha de Renta</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagos.map(renta => {
                    const cliente = clientes.find(c => c.nombre === renta.nombre && c.telefono === renta.telefono);
                    return (
                      <tr key={renta._id} className="hover:bg-gray-50">
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={renta.nombre}>{renta.nombre}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[100px] truncate" title={renta.telefono}>{renta.telefono}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(renta.total_renta).toFixed(2)}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={renta.fecha_renta}>{renta.fecha_renta}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={renta.updatedAt ? dayjs(renta.updatedAt).format('DD/MM/YYYY') : '-'}>{renta.updatedAt ? dayjs(renta.updatedAt).format('DD/MM/YYYY') : '-'}</td>
                        <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
                            title="Pagada"
                            disabled
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PaymentsPage;