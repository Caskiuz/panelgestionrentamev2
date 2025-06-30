import React, { useState, useEffect } from 'react';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { PlusCircle, Edit, Trash2, Bell } from 'lucide-react';

const CATEGORIAS = [
  'Luz', 'Agua', 'Internet', 'Cable', 'Aseo', 'Suscripción', 'Otro'
];

function ServicesPage() {
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('cobrogest_services');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    fechaVencimiento: '',
    pagado: false,
    recordatorio: false,
    emailRecordatorio: '',
    frecuencia: 'mensual',
    notas: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    localStorage.setItem('cobrogest_services', JSON.stringify(services));
  }, [services]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService({ ...newService, [name]: type === 'checkbox' ? checked : value });
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
    setNewService({ nombre: '', categoria: '', descripcion: '', precio: '', fechaVencimiento: '', pagado: false, recordatorio: false, emailRecordatorio: '', frecuencia: 'mensual', notas: '' });
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

  const handleTogglePagado = (idx) => {
    const updated = services.map((s, i) => i === idx ? { ...s, pagado: !s.pagado } : s);
    setServices(updated);
  };

  // Métricas
  const serviciosPorPagar = services.filter(s => !s.pagado).length;
  const serviciosConRecordatorio = services.filter(s => s.recordatorio).length;
  const serviciosProximos = services.filter(s => {
    if (!s.fechaVencimiento) return false;
    const hoy = new Date();
    const fecha = new Date(s.fechaVencimiento);
    const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7 && !s.pagado;
  }).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#C70000] to-[#0D6EFD] font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-2 md:p-8 overflow-y-auto bg-gray-100 min-h-screen md:ml-0 md:pl-64 transition-all duration-300">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Mis Servicios Generales y Suscripciones
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingIndex(null); setNewService({ nombre: '', categoria: '', descripcion: '', precio: '', fechaVencimiento: '', pagado: false, recordatorio: false, emailRecordatorio: '', frecuencia: 'mensual', notas: '' }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir Servicio
          </button>
        </header>
        {/* Métricas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-lg font-semibold text-blue-900">Servicios por Pagar</span>
            <span className="text-3xl font-bold text-[#C70000]">{serviciosPorPagar}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-lg font-semibold text-green-900">Con Recordatorio Activo</span>
            <span className="text-3xl font-bold text-green-700">{serviciosConRecordatorio}</span>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow flex flex-col items-center">
            <span className="text-lg font-semibold text-yellow-900">Próximos a Vencer (7 días)</span>
            <span className="text-3xl font-bold text-yellow-700">{serviciosProximos}</span>
          </div>
        </section>
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
                  <label htmlFor="categoria" className="block text-gray-700 text-sm font-semibold mb-2">Categoría:</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={newService.categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    {CATEGORIAS.map(cat => <option key={cat}>{cat}</option>)}
                  </select>
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
                  <label htmlFor="fechaVencimiento" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Vencimiento:</label>
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
                  <label htmlFor="descripcion" className="block text-gray-700 text-sm font-semibold mb-2">Descripción:</label>
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
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="pagado"
                      checked={newService.pagado}
                      onChange={handleInputChange}
                    />
                    Pagado
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="recordatorio"
                      checked={newService.recordatorio}
                      onChange={handleInputChange}
                    />
                    <Bell className="w-4 h-4 text-blue-600" /> Activar recordatorio
                  </label>
                  <input
                    type="email"
                    name="emailRecordatorio"
                    value={newService.emailRecordatorio}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1"
                    placeholder="Email para recordatorio"
                  />
                  <select
                    name="frecuencia"
                    value={newService.frecuencia}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1"
                  >
                    <option value="mensual">Mensual</option>
                    <option value="anual">Anual</option>
                    <option value="única">Única vez</option>
                  </select>
                </div>
                <input
                  name="notas"
                  value={newService.notas}
                  onChange={handleInputChange}
                  placeholder="Notas adicionales"
                  className="border rounded px-2 py-1 w-full"
                />
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
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Servicios Generales y Suscripciones</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {services.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay servicios registrados.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[900px] w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Pagado</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Recordatorio</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                    <th className="px-2 md:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[120px] truncate" title={service.nombre}>{service.nombre}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">{service.categoria || '-'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700">${parseFloat(service.precio).toFixed(2)}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[120px] truncate" title={service.fechaVencimiento}>{service.fechaVencimiento || '-'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-gray-700 max-w-[180px] truncate" title={service.descripcion}>{service.descripcion || '-'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleTogglePagado(idx)} className={`px-2 py-1 rounded ${service.pagado ? 'bg-green-200' : 'bg-red-200'}`}>{service.pagado ? 'Sí' : 'No'}</button>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">{service.recordatorio ? 'Sí' : 'No'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">{service.emailRecordatorio || '-'}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">{service.frecuencia}</td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">{service.notas || '-'}</td>
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
