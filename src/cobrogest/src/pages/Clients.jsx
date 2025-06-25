import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { Users, PlusCircle, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react'; // Iconos

// Las funciones para cargar y guardar clientes en localStorage
const CLIENTS_KEY = 'cobrogest_clients';

const loadClients = () => {
  try {
    const serializedClients = localStorage.getItem(CLIENTS_KEY);
    if (serializedClients === null) {
      return [];
    }
    return JSON.parse(serializedClients);
  } catch (error) {
    console.error("Error al cargar clientes de localStorage:", error);
    return [];
  }
};

const saveClients = (clients) => {
  try {
    const serializedClients = JSON.stringify(clients);
    localStorage.setItem(CLIENTS_KEY, serializedClients);
  } catch (error) {
    console.error("Error al guardar clientes en localStorage:", error);
  }
};


function ClientsPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [editingClientId, setEditingClientId] = useState(null);

  // Cargar clientes al inicio
  useEffect(() => {
    setClients(loadClients());
  }, []);

  // Guardar clientes cada vez que el estado 'clients' cambia
  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddOrUpdateClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) {
      alert('Por favor, completa los campos de Nombre y Email.');
      return;
    }

    if (editingClientId) {
      // Actualizar cliente existente
      setClients(clients.map(client =>
        client.id === editingClientId ? { ...newClient, id: editingClientId } : client
      ));
      setEditingClientId(null);
    } else {
      // Añadir nuevo cliente
      setClients([...clients, { ...newClient, id: uuidv4() }]);
    }
    setNewClient({ name: '', email: '', phone: '', address: '', notes: '' });
    setShowAddForm(false);
  };

  const handleEditClient = (clientId) => {
    const clientToEdit = clients.find(client => client.id === clientId);
    if (clientToEdit) {
      setNewClient(clientToEdit);
      setEditingClientId(clientId);
      setShowAddForm(true);
    }
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
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
            Gestión de Clientes
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingClientId(null); setNewClient({ name: '', email: '', phone: '', address: '', notes: '' }); }}
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
              <form onSubmit={handleAddOrUpdateClient} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo del cliente"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">Teléfono (opcional):</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: +58 412 1234567"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">Dirección (opcional):</label>
                  <textarea
                    id="address"
                    name="address"
                    value={newClient.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dirección del cliente"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2">Notas (opcional):</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newClient.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cualquier nota adicional sobre el cliente"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    {editingClientId ? 'Actualizar Cliente' : 'Guardar Cliente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listado de Clientes */}
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Clientes</h3>
          {clients.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay clientes registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-1"><Mail className="w-4 h-4" />{client.email}</div>
                        {client.phone && <div className="flex items-center gap-1 mt-1"><Phone className="w-4 h-4" />{client.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {client.address && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{client.address}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.notes || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClient(client.id)}
                            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            title="Editar Cliente"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
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
