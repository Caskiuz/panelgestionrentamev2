import React, { useState } from 'react';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    fechaVencimiento: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleAddOrUpdateService = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newService.nombre || !newService.precio) {
      setErrorMsg('Por favor, completa los campos requeridos (Nombre y Precio).');
      return;
    }
    if (editingIndex !== null) {
      const updated = [...services];
      updated[editingIndex] = newService;
      setServices(updated);
      setEditingIndex(null);
    } else {
      setServices([...services, newService]);
    }
    setShowAddForm(false);
    setNewService({ nombre: '', descripcion: '', precio: '', fechaVencimiento: '' });
  };

  const handleEditService = (idx) => {
    setNewService(services[idx]);
    setEditingIndex(idx);
    setShowAddForm(true);
  };

  const handleDeleteService = (idx) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setServices(services.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Mis Servicios Manuales (Suscripciones)
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingIndex(null); setNewService({ nombre: '', descripcion: '', precio: '', fechaVencimiento: '' }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir Servicio
          </button>
        </header>
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingIndex !== null ? 'Editar Servicio' : 'Añadir Servicio'}</h2>
              {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
              <form onSubmit={handleAddOrUpdateService} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 text-sm font-semibold mb-2">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={newService.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Netflix, Internet, Spotify"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="precio" className="block text-gray-700 text-sm font-semibold mb-2">Precio:</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={newService.precio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Monto mensual"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fechaVencimiento" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Vencimiento (opcional):</label>
                  <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    value={newService.fechaVencimiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="descripcion" className="block text-gray-700 text-sm font-semibold mb-2">Descripción (opcional):</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={newService.descripcion}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalles del servicio"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setErrorMsg(""); }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    {editingIndex !== null ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Listado de Servicios Manuales */}
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Servicios Manuales</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {services.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay servicios registrados.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={service.nombre}>{service.nombre}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(service.precio).toFixed(2)}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={service.fechaVencimiento}>{service.fechaVencimiento || '-'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[180px] truncate" title={service.descripcion}>{service.descripcion || '-'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEditService(idx)}
                            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(idx)}
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

export default ServicesPage;
