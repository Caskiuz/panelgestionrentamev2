import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos
import dayjs from 'dayjs'; // Para manejar fechas
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isBetween from 'dayjs/plugin/isBetween';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { loadServices, saveServices } from '../utils/dataStorage'; // Importa las utilidades de almacenamiento
import { PlusCircle, Calendar, DollarSign, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'; // Iconos

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

function ServicesPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [services, setServices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    amount: '',
    dueDate: dayjs().format('YYYY-MM-DD'),
    lastPaidDate: '', // Opcional: fecha del último pago
    isPaidCurrentPeriod: false, // Indicador para el pago del periodo actual (ej. mes)
    description: '',
  });
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Cargar servicios al inicio
  useEffect(() => {
    setServices(loadServices());
  }, []);

  // Guardar servicios cada vez que el estado 'services' cambia
  useEffect(() => {
    saveServices(services);
  }, [services]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleAddOrUpdateService = (e) => {
    e.preventDefault();
    if (!newService.name || !newService.amount || !newService.dueDate) {
      alert('Por favor, completa todos los campos requeridos (Nombre del Servicio, Monto, Fecha de Vencimiento).');
      return;
    }

    if (editingServiceId) {
      // Actualizar servicio existente
      setServices(services.map(service =>
        service.id === editingServiceId ? { ...newService, id: editingServiceId } : service
      ));
      setEditingServiceId(null);
    } else {
      // Añadir nuevo servicio
      setServices([...services, { ...newService, id: uuidv4() }]);
    }
    setNewService({ name: '', amount: '', dueDate: dayjs().format('YYYY-MM-DD'), lastPaidDate: '', isPaidCurrentPeriod: false, description: '' });
    setShowAddForm(false);
  };

  const handleEditService = (serviceId) => {
    const serviceToEdit = services.find(service => service.id === serviceId);
    if (serviceToEdit) {
      setNewService(serviceToEdit);
      setEditingServiceId(serviceId);
      setShowAddForm(true);
    }
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const handleTogglePaidCurrentPeriod = (serviceId) => {
    setServices(services.map(service =>
      service.id === serviceId ? { ...service, isPaidCurrentPeriod: !service.isPaidCurrentPeriod, lastPaidDate: service.isPaidCurrentPeriod ? service.lastPaidDate : dayjs().format('YYYY-MM-DD') } : service
    ));
  };

  const getStatus = (dueDate, isPaidCurrentPeriod) => {
    if (isPaidCurrentPeriod) return 'Pagado';
    const due = dayjs(dueDate);
    const today = dayjs();

    if (due.isBefore(today, 'day')) return 'Atrasado';
    if (due.isSame(today, 'day')) return 'Hoy';
    return 'Pendiente';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pagado': return 'text-green-600 bg-green-100';
      case 'Atrasado': return 'text-red-600 bg-red-100';
      case 'Hoy': return 'text-orange-600 bg-orange-100';
      case 'Pendiente': return 'text-blue-600 bg-blue-100';
      default: return '';
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
            Mis Servicios a Pagar
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingServiceId(null); setNewService({ name: '', amount: '', dueDate: dayjs().format('YYYY-MM-DD'), lastPaidDate: '', isPaidCurrentPeriod: false, description: '' }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir Nuevo Servicio
          </button>
        </header>

        {/* Formulario para añadir/editar servicio */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingServiceId ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</h2>
              <form onSubmit={handleAddOrUpdateService} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Nombre del Servicio:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newService.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Netflix, Internet"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-gray-700 text-sm font-semibold mb-2">Monto:</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newService.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Monto a pagar"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Vencimiento (este periodo):</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={newService.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Descripción (opcional):</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newService.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalles adicionales sobre el servicio"
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
                    {editingServiceId ? 'Actualizar Servicio' : 'Guardar Servicio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listado de Servicios */}
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Servicios a Pagar</h3>
          {services.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay servicios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Pago
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => {
                    const status = getStatus(service.dueDate, service.isPaidCurrentPeriod);
                    return (
                      <tr key={service.id} className={`${service.isPaidCurrentPeriod ? 'opacity-70 line-through' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(service.amount).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {dayjs(service.dueDate).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {service.lastPaidDate ? dayjs(service.lastPaidDate).format('DD/MM/YYYY') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleTogglePaidCurrentPeriod(service.id)}
                              className={`p-2 rounded-full text-white ${service.isPaidCurrentPeriod ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
                              title={service.isPaidCurrentPeriod ? 'Marcar como Pendiente' : 'Marcar como Pagado este periodo'}
                            >
                              {service.isPaidCurrentPeriod ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </button>
                            {!service.isPaidCurrentPeriod && (
                              <button
                                onClick={() => handleEditService(service.id)}
                                className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                title="Editar"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
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

export default ServicesPage;
