import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { Users, PlusCircle, Edit, Trash2 } from 'lucide-react';

// Cambiar endpoint a /api/clients para coincidir con el backend
const API_BASE = 'https://backrecordatoriorenta-production.up.railway.app/api/clients';

function ClientsPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    nombre: '',
    telefono: '',
    foto_ine_delantero: '',
    foto_ine_trasero: '',
  });
  const [editingClientId, setEditingClientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtener token
  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Cargar clientes desde backend
  const fetchClients = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axios.get(`${API_BASE}`, axiosConfig);
      setClients(data.response || []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al cargar clientes');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddOrUpdateClient = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newClient.nombre || !newClient.telefono) {
      setErrorMsg('Por favor, completa los campos requeridos (Nombre y Teléfono).');
      return;
    }
    setLoading(true);
    try {
      if (editingClientId) {
        // Editar cliente
        await axios.put(`${API_BASE}/update/${editingClientId}`, newClient, axiosConfig);
      } else {
        // Crear cliente
        await axios.post(`${API_BASE}/create`, newClient, axiosConfig);
      }
      setShowAddForm(false);
      setEditingClientId(null);
      setNewClient({ nombre: '', telefono: '', foto_ine_delantero: '', foto_ine_trasero: '' });
      fetchClients();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || 'Error al guardar el cliente');
    }
    setLoading(false);
  };

  const handleEditClient = (clientId) => {
    const clientToEdit = clients.find(client => client._id === clientId);
    if (clientToEdit) {
      setNewClient({
        nombre: clientToEdit.nombre || '',
        telefono: clientToEdit.telefono || '',
        foto_ine_delantero: clientToEdit.foto_ine_delantero || '',
        foto_ine_trasero: clientToEdit.foto_ine_trasero || '',
      });
      setEditingClientId(clientId);
      setShowAddForm(true);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setLoading(true);
      setErrorMsg("");
      try {
        await axios.delete(`${API_BASE}/delete`, { ...axiosConfig, data: { _id: clientId } });
        fetchClients();
      } catch (e) {
        setErrorMsg(e?.response?.data?.message || 'Error al eliminar el cliente');
      }
      setLoading(false);
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
            Gestión de Clientes
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingClientId(null); setNewClient({ nombre: '', telefono: '', foto_ine_delantero: '', foto_ine_trasero: '' }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir Nuevo Cliente
          </button>
        </header>
        {/* Formulario para añadir/editar cliente */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingClientId ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</h2>
              {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
              <form onSubmit={handleAddOrUpdateClient} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 text-sm font-semibold mb-2">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={newClient.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo del cliente"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-gray-700 text-sm font-semibold mb-2">Teléfono:</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={newClient.telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 9811234567"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="foto_ine_delantero" className="block text-gray-700 text-sm font-semibold mb-2">Foto INE Delantera (URL):</label>
                  <input
                    type="text"
                    id="foto_ine_delantero"
                    name="foto_ine_delantero"
                    value={newClient.foto_ine_delantero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de la foto del INE delantero"
                  />
                </div>
                <div>
                  <label htmlFor="foto_ine_trasero" className="block text-gray-700 text-sm font-semibold mb-2">Foto INE Trasera (URL):</label>
                  <input
                    type="text"
                    id="foto_ine_trasero"
                    name="foto_ine_trasero"
                    value={newClient.foto_ine_trasero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de la foto del INE trasero"
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
                    {loading ? 'Guardando...' : (editingClientId ? 'Actualizar Cliente' : 'Guardar Cliente')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Listado de Clientes */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Listado de Clientes</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {clients.length === 0 && !loading ? (
            <p className="text-gray-600 text-center py-8">No hay clientes registrados.</p>
          ) : loading ? (
            <div className="text-center py-8 text-blue-600 font-semibold">Cargando clientes...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">INE Delantera</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">INE Trasera</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={client.nombre}>{client.nombre}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[100px] truncate" title={client.telefono}>{client.telefono}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate">
                        {client.foto_ine_delantero ? (
                          <a href={client.foto_ine_delantero} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a>
                        ) : '-'}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate">
                        {client.foto_ine_trasero ? (
                          <a href={client.foto_ine_trasero} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a>
                        ) : '-'}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEditClient(client._id)}
                            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            title="Editar Cliente"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client._id)}
                            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                            title="Eliminar Cliente"
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

export default ClientsPage;