import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos
import dayjs from 'dayjs'; // Para manejar fechas
import isToday from 'dayjs/plugin/isToday'; // Plugin para verificar si es hoy
import isYesterday from 'dayjs/plugin/isYesterday'; // Plugin para verificar si es ayer
import isBetween from 'dayjs/plugin/isBetween'; // Plugin para verificar si está entre fechas
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import { loadDebts, saveDebts } from '../utils/dataStorage'; // Importa las utilidades de almacenamiento
import { PlusCircle, Calendar, Users, DollarSign, Edit, Trash2 } from 'lucide-react'; // Iconos

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

function DebtsPage() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [debts, setDebts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDebt, setNewDebt] = useState({
    clientName: '',
    amount: '',
    dueDate: dayjs().format('YYYY-MM-DD'), // Fecha de hoy por defecto
    description: '',
    isPaid: false,
  });
  const [editingDebtId, setEditingDebtId] = useState(null); // Para saber qué deuda estamos editando

  // Cargar deudas al inicio
  useEffect(() => {
    setDebts(loadDebts());
  }, []);

  // Guardar deudas cada vez que el estado 'debts' cambia
  useEffect(() => {
    saveDebts(debts);
  }, [debts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDebt({ ...newDebt, [name]: value });
  };

  const handleAddOrUpdateDebt = (e) => {
    e.preventDefault();
    if (!newDebt.clientName || !newDebt.amount || !newDebt.dueDate) {
      alert('Por favor, completa todos los campos requeridos (Cliente, Monto, Fecha de Vencimiento).');
      return;
    }

    if (editingDebtId) {
      // Actualizar deuda existente
      setDebts(debts.map(debt =>
        debt.id === editingDebtId ? { ...newDebt, id: editingDebtId } : debt
      ));
      setEditingDebtId(null);
    } else {
      // Añadir nueva deuda
      setDebts([...debts, { ...newDebt, id: uuidv4() }]);
    }
    setNewDebt({ clientName: '', amount: '', dueDate: dayjs().format('YYYY-MM-DD'), description: '', isPaid: false });
    setShowAddForm(false);
  };

  const handleEditDebt = (debtId) => {
    const debtToEdit = debts.find(debt => debt.id === debtId);
    if (debtToEdit) {
      setNewDebt(debtToEdit);
      setEditingDebtId(debtId);
      setShowAddForm(true);
    }
  };

  const handleDeleteDebt = (debtId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
      setDebts(debts.filter(debt => debt.id !== debtId));
    }
  };

  const handleTogglePaid = (debtId) => {
    setDebts(debts.map(debt =>
      debt.id === debtId ? { ...debt, isPaid: !debt.isPaid } : debt
    ));
  };

  const getStatus = (dueDate, isPaid) => {
    if (isPaid) return 'Pagada';
    const due = dayjs(dueDate);
    const today = dayjs();

    if (due.isBefore(today, 'day')) return 'Atrasada';
    if (due.isSame(today, 'day')) return 'Hoy';
    if (due.isAfter(today, 'day')) return 'Pendiente';
    return '';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pagada': return 'text-green-600 bg-green-100';
      case 'Atrasada': return 'text-red-600 bg-red-100';
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
            Deudas por Cobrar
          </h1>
          <button
            onClick={() => { setShowAddForm(true); setEditingDebtId(null); setNewDebt({ clientName: '', amount: '', dueDate: dayjs().format('YYYY-MM-DD'), description: '', isPaid: false }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Añadir Nueva Deuda
          </button>
        </header>

        {/* Formulario para añadir/editar deuda */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{editingDebtId ? 'Editar Deuda' : 'Añadir Nueva Deuda'}</h2>
              <form onSubmit={handleAddOrUpdateDebt} className="space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-gray-700 text-sm font-semibold mb-2">Cliente:</label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={newDebt.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-gray-700 text-sm font-semibold mb-2">Monto:</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newDebt.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Monto de la deuda"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-gray-700 text-sm font-semibold mb-2">Fecha de Vencimiento:</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={newDebt.dueDate}
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
                    value={newDebt.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalles adicionales sobre la deuda"
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
                    {editingDebtId ? 'Actualizar Deuda' : 'Guardar Deuda'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listado de Deudas */}
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Deudas</h3>
          {debts.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay deudas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
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
                  {debts.map((debt) => {
                    const status = getStatus(debt.dueDate, debt.isPaid);
                    return (
                      <tr key={debt.id} className={`${debt.isPaid ? 'opacity-70 line-through' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{debt.clientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(debt.amount).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {dayjs(debt.dueDate).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{debt.description || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleTogglePaid(debt.id)}
                              className={`p-2 rounded-full text-white ${debt.isPaid ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
                              title={debt.isPaid ? 'Marcar como Pendiente' : 'Marcar como Pagada'}
                            >
                              {debt.isPaid ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.07L3.01 8.252a.735.735 0 0 1 .01-1.05.733.733 0 0 1 1.047 0L7.006 10.23l5.05-5.262z"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7.000 7a.5.5 0 0 1-.708 0l-3.500-3.5a.5.5 0 1 1 .708-.708L6.500 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg>
                              )}
                            </button>
                            {!debt.isPaid && (
                              <button
                                onClick={() => handleEditDebt(debt.id)}
                                className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                title="Editar"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDebt(debt.id)}
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

export default DebtsPage;
