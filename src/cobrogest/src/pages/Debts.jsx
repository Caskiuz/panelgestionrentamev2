import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const API_BASE = 'https://backrecordatoriorenta-production.up.railway.app/api/rentas';

function DebtsPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [rentas, setRentas] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRenta, setNewRenta] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    fecha_renta: dayjs().format('YYYY-MM-DD'),
    hora_renta: '',
    fecha_vencimiento: dayjs().format('YYYY-MM-DD'),
    productos: [],
    total_renta: '',
    fotos_estado_inicial: [],
    IVA: false,
  });
  const [editingRentaId, setEditingRentaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtener token
  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Cargar rentas desde backend
  const fetchRentas = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axios.get(`${API_BASE}/`, axiosConfig);
      setRentas(data.response || []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al cargar rentas');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRentas();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRenta({ ...newRenta, [name]: value });
  };

  const handleAddOrUpdateRenta = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newRenta.nombre || !newRenta.telefono || !newRenta.direccion || !newRenta.fecha_renta || !newRenta.total_renta) {
      setErrorMsg('Por favor, completa todos los campos requeridos.');
      return;
    }
    setLoading(true);
    try {
      if (editingRentaId) {
        // Editar renta
        await axios.put(`${API_BASE}/update/${editingRentaId}`, newRenta, axiosConfig);
      } else {
        // Crear renta
        await axios.post(`${API_BASE}/create`, newRenta, axiosConfig);
      }
      setShowAddForm(false);
      setEditingRentaId(null);
      setNewRenta({ nombre: '', telefono: '', direccion: '', fecha_renta: dayjs().format('YYYY-MM-DD'), hora_renta: '', fecha_vencimiento: dayjs().format('YYYY-MM-DD'), productos: [], total_renta: '', fotos_estado_inicial: [], IVA: false });
      fetchRentas();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al guardar la renta');
    }
    setLoading(false);
  };

  const handleEditRenta = (rentaId) => {
    const rentaToEdit = rentas.find(renta => renta._id === rentaId);
    if (rentaToEdit) {
      setNewRenta({
        nombre: rentaToEdit.nombre || '',
        telefono: rentaToEdit.telefono || '',
        direccion: rentaToEdit.direccion || '',
        fecha_renta: rentaToEdit.fecha_renta ? dayjs(rentaToEdit.fecha_renta).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        hora_renta: rentaToEdit.hora_renta || '',
        fecha_vencimiento: rentaToEdit.fecha_vencimiento ? dayjs(rentaToEdit.fecha_vencimiento).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        productos: rentaToEdit.productos || [],
        total_renta: rentaToEdit.total_renta || '',
        fotos_estado_inicial: rentaToEdit.fotos_estado_inicial || [],
        IVA: rentaToEdit.IVA || false,
      });
      setEditingRentaId(rentaId);
      setShowAddForm(true);
    }
  };

  const handleDeleteRenta = async (rentaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta renta?')) {
      setLoading(true);
      setErrorMsg("");
      try {
        await axios.delete(`${API_BASE}/delete`, { ...axiosConfig, data: { _id: rentaId } });
        fetchRentas();
      } catch (e) {
        setErrorMsg(e?.response?.data?.message || 'Error al eliminar la renta');
      }
      setLoading(false);
    }
  };

  const getStatus = (estado_renta) => {
    switch (estado_renta) {
      case 'Pagada': return 'Pagada';
      case 'Vencido': return 'Atrasada';
      case 'Activo': return 'Pendiente';
      default: return estado_renta;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pagada': return 'text-green-600 bg-green-100';
      case 'Atrasada': return 'text-red-600 bg-red-100';
      case 'Pendiente': return 'text-blue-600 bg-blue-100';
      default: return '';
    }
  };

  if (isLoading || !userData || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#C70000] to-[#0D6EFD] font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-2 md:p-8 overflow-y-auto bg-gray-100 min-h-screen md:ml-0 md:pl-64 transition-all duration-300">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Gestión de Cobros/Rentas
          </h1>
        </header>

        {/* Formulario para añadir/editar renta */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingRentaId ? 'Editar Renta' : 'Añadir Nueva Renta'}</h2>
              {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
              <form onSubmit={handleAddOrUpdateRenta} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 text-sm font-semibold mb-2">Cliente:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={newRenta.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-gray-700 text-sm font-semibold mb-2">Teléfono:</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={newRenta.telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Teléfono del cliente"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="direccion" className="block text-gray-700 text-sm font-semibold mb-2">Dirección:</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={newRenta.direccion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dirección de la renta"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fecha_renta" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Renta:</label>
                  <input
                    type="date"
                    id="fecha_renta"
                    name="fecha_renta"
                    value={newRenta.fecha_renta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hora_renta" className="block text-gray-700 text-sm font-semibold mb-2">Hora de Renta:</label>
                  <input
                    type="time"
                    id="hora_renta"
                    name="hora_renta"
                    value={newRenta.hora_renta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fecha_vencimiento" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Vencimiento:</label>
                  <input
                    type="date"
                    id="fecha_vencimiento"
                    name="fecha_vencimiento"
                    value={newRenta.fecha_vencimiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="total_renta" className="block text-gray-700 text-sm font-semibold mb-2">Total de Renta:</label>
                  <input
                    type="number"
                    id="total_renta"
                    name="total_renta"
                    value={newRenta.total_renta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Total de la renta"
                    step="0.01"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setErrorMsg(""); }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : (editingRentaId ? 'Actualizar Renta' : 'Guardar Renta')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listado de Rentas/Deudas */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Listado de Rentas</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {rentas.length === 0 && !loading ? (
            <p className="text-gray-600 text-center py-8">No hay rentas registradas.</p>
          ) : loading ? (
            <div className="text-center py-8 text-blue-600 font-semibold">Cargando rentas...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[900px] w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha Renta</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentas.map((renta) => (
                    <tr key={renta._id} className="hover:bg-gray-50">
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={renta.nombre}>{renta.nombre}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[100px] truncate" title={renta.telefono}>{renta.telefono}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={renta.direccion}>{renta.direccion}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">{renta.fecha_renta}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">{renta.fecha_vencimiento}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(renta.total_renta || 0).toFixed(2)}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleTogglePaid(renta._id)}
                            className={`p-2 rounded-full text-white ${renta.estado_renta === 'Pagada' ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
                            title={renta.estado_renta === 'Pagada' ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
                          >
                            {renta.estado_renta === 'Pagada' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleEditRenta(renta._id)}
                            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRenta(renta._id)}
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DebtsPage;