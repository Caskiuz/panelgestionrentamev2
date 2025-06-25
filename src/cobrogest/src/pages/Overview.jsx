import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isToday);
dayjs.extend(isBetween);

// ¡CORRECCIÓN AQUÍ! Asegúrate de importar todos los íconos de Lucide React que uses.
import { Home, Users, DollarSign, CreditCard, Settings, LogOut, Calendar } from 'lucide-react';

import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { loadDebts, loadServices } from '../utils/dataStorage';

function Overview() {
  const navigate = useNavigate();
  const { userData, globalMetrics, isLoading } = useAuthAndMetrics();

  const [cobroGestMetrics, setCobroGestMetrics] = useState({
    cobrosHoy: 0,
    pagosHoy: 0,
    cobrosAtrasados: 0,
    pagosAtrasados: 0,
    clientesConDeuda: 0,
    serviciosPorPagar: 0,
  });

  const [debtsDueToday, setDebtsDueToday] = useState([]);
  const [overdueDebts, setOverdueDebts] = useState([]);
  const [servicesDueToday, setServicesDueToday] = useState([]);
  const [overdueServices, setOverdueServices] = useState([]);

  useEffect(() => {
    const allDebts = loadDebts();
    const allServices = loadServices();
    const today = dayjs();

    const totalCobrosHoy = allDebts.filter(debt =>
      !debt.isPaid && dayjs(debt.dueDate).isSame(today, 'day')
    ).reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

    const totalPagosHoy = allServices.filter(service =>
      !service.isPaidCurrentPeriod && dayjs(service.dueDate).isSame(today, 'day')
    ).reduce((sum, service) => sum + parseFloat(service.amount || 0), 0);

    const totalCobrosAtrasados = allDebts.filter(debt =>
      !debt.isPaid && dayjs(debt.dueDate).isBefore(today, 'day')
    ).reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);

    const totalPagosAtrasados = allServices.filter(service =>
      !service.isPaidCurrentPeriod && dayjs(service.dueDate).isBefore(today, 'day')
    ).reduce((sum, service) => sum + parseFloat(service.amount || 0), 0);

    const uniqueClientsWithActiveDebt = new Set(
      allDebts.filter(debt => !debt.isPaid).map(debt => debt.clientName.toLowerCase())
    ).size;

    const totalServicesToPay = allServices.filter(service => !service.isPaidCurrentPeriod).length;

    setCobroGestMetrics({
      cobrosHoy: totalCobrosHoy,
      pagosHoy: totalPagosHoy,
      cobrosAtrasados: totalCobrosAtrasados,
      pagosAtrasados: totalPagosAtrasados,
      clientesConDeuda: uniqueClientsWithActiveDebt,
      serviciosPorPagar: totalServicesToPay,
    });

    setDebtsDueToday(allDebts.filter(debt =>
      !debt.isPaid && dayjs(debt.dueDate).isSame(today, 'day')
    ));
    setOverdueDebts(allDebts.filter(debt =>
      !debt.isPaid && dayjs(debt.dueDate).isBefore(today, 'day')
    ));
    setServicesDueToday(allServices.filter(service =>
      !service.isPaidCurrentPeriod && dayjs(service.dueDate).isSame(today, 'day')
    ));
    setOverdueServices(allServices.filter(service =>
      !service.isPaidCurrentPeriod && dayjs(service.dueDate).isBefore(today, 'day')
    ));

  }, [/* dependencies for useEffect, consider adding specific state updates if needed */]); // Se recalcula si los datos de la lista cambian

  // Manejo de estados de carga y si no hay datos de usuario
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        Cargando dashboard CobroGest...
      </div>
    );
  }

  if (!userData) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <CobroGestSidebar />

      <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Bienvenido, <span className="text-blue-600">{userData.nombre || 'Usuario'}!</span>
          </h1>
        </header>

        {/* Sección de Métricas Globales del Proyecto Principal */}
        <section className="bg-white p-6 rounded-xl shadow-inner mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Métricas del Proyecto Principal</h3>
          <p className="text-gray-600">Estas son métricas globales obtenidas de tu aplicación principal.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Deudas Pendientes (Global)</p>
              <p className="text-3xl font-bold text-blue-700">{globalMetrics.deudasPendientes || 'N/A'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Pagos Recibidos (mes, Global)</p>
              <p className="text-3xl font-bold text-green-700">{globalMetrics.pagosRecibidosMes || 'N/A'}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Clientes Activos (Global)</p>
              <p className="text-3xl font-bold text-yellow-700">{globalMetrics.clientesActivos || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Sección de Métricas Clave de CobroGest (calculadas dinámicamente) */}
        <section className="bg-white p-6 rounded-xl shadow-inner mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Resumen de Cobros y Pagos</h3>
          <p className="text-gray-600">Control detallado de tus finanzas personales y empresariales.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="bg-orange-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
              <p className="text-gray-500 text-sm text-center">Cobros para Hoy</p>
              <p className="text-3xl font-bold text-orange-700">${cobroGestMetrics.cobrosHoy.toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-gray-500 text-sm text-center">Pagos de Servicios Hoy</p>
              <p className="text-3xl font-bold text-purple-700">${cobroGestMetrics.pagosHoy.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <DollarSign className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-gray-500 text-sm text-center">Cobros Atrasados</p>
              <p className="text-3xl font-bold text-red-700">${cobroGestMetrics.cobrosAtrasados.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <CreditCard className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-gray-500 text-sm text-center">Servicios Atrasados</p>
              <p className="text-3xl font-bold text-red-700">${cobroGestMetrics.pagosAtrasados.toFixed(2)}</p>
            </div>
             <div className="bg-indigo-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <Users className="w-8 h-8 text-indigo-600 mb-2" />
              <p className="text-gray-500 text-sm text-center">Clientes con Deuda</p>
              <p className="text-3xl font-bold text-indigo-700">{cobroGestMetrics.clientesConDeuda}</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <Home className="w-8 h-8 text-teal-600 mb-2" />
              <p className="text-gray-500 text-sm text-center">Servicios por Pagar</p>
              <p className="text-3xl font-bold text-teal-700">{cobroGestMetrics.serviciosPorPagar}</p>
            </div>
          </div>
        </section>

        {/* Sección de Recordatorios */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Cobros para Hoy */}
          <div className="bg-white p-6 rounded-xl shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-600" />
              Cobros para Hoy ({debtsDueToday.length})
            </h3>
            {debtsDueToday.length === 0 ? (
              <p className="text-gray-600">No hay cobros pendientes para hoy.</p>
            ) : (
              <ul className="space-y-3">
                {debtsDueToday.map(debt => (
                  <li key={debt.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex justify-between items-center text-orange-800">
                    <span>{debt.clientName}: ${parseFloat(debt.amount).toFixed(2)}</span>
                    <span className="text-sm">Vence: {dayjs(debt.dueDate).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pagos de Servicios para Hoy */}
          <div className="bg-white p-6 rounded-xl shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Pagos de Servicios para Hoy ({servicesDueToday.length})
            </h3>
            {servicesDueToday.length === 0 ? (
              <p className="text-gray-600">No hay pagos de servicios pendientes para hoy.</p>
            ) : (
              <ul className="space-y-3">
                {servicesDueToday.map(service => (
                  <li key={service.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-center text-purple-800">
                    <span>{service.name}: ${parseFloat(service.amount).toFixed(2)}</span>
                    <span className="text-sm">Vence: {dayjs(service.dueDate).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cobros Atrasados */}
          <div className="bg-white p-6 rounded-xl shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-red-600" />
              Cobros Atrasados ({overdueDebts.length})
            </h3>
            {overdueDebts.length === 0 ? (
              <p className="text-gray-600">¡Excelente! No hay cobros atrasados.</p>
            ) : (
              <ul className="space-y-3">
                {overdueDebts.map(debt => (
                  <li key={debt.id} className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center text-red-800">
                    <span>{debt.clientName}: ${parseFloat(debt.amount).toFixed(2)}</span>
                    <span className="text-sm">Venció: {dayjs(debt.dueDate).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Servicios Atrasados */}
          <div className="bg-white p-6 rounded-xl shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-red-600" />
              Servicios Atrasados ({overdueServices.length})
            </h3>
            {overdueServices.length === 0 ? (
              <p className="text-gray-600">¡Felicitaciones! No tienes servicios atrasados.</p>
            ) : (
              <ul className="space-y-3">
                {overdueServices.map(service => (
                  <li key={service.id} className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center text-red-800">
                    <span>{service.name}: ${parseFloat(service.amount).toFixed(2)}</span>
                    <span className="text-sm">Venció: {dayjs(service.dueDate).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Overview;
