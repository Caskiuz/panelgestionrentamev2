import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import axios from 'axios';

dayjs.extend(isToday);
dayjs.extend(isBetween);

import { Home, Users, DollarSign, CreditCard, Calendar } from 'lucide-react';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';
import CobroGestSidebar from '../components/CobroGestSidebar';

const API_RENTAS = 'https://backrecordatoriorenta-production.up.railway.app/api/rentas';
const API_SERVICIOS = 'https://backrecordatoriorenta-production.up.railway.app/api/servicios';
const API_CLIENTES = 'https://backrecordatoriorenta-production.up.railway.app/api/clients';

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtener token
  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const today = dayjs();
    // Obtener servicios desde localStorage
    let allServices = [];
    try {
      const saved = localStorage.getItem('cobrogest_services');
      allServices = saved ? JSON.parse(saved) : [];
    } catch (e) {
      allServices = [];
    }
    // Rentas (deudas) desde backend
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const { data: rentasData } = await axios.get(`${API_RENTAS}/`, axiosConfig);
        const allDebts = rentasData.response || [];
        // Clientes
        let allClients = [];
        try {
          const { data: clientesData } = await axios.get(`${API_CLIENTES}`, axiosConfig);
          allClients = clientesData.response || [];
        } catch (e) {
          allClients = [];
        }
        // Cobros para hoy (deudas no pagadas que vencen hoy)
        const debtsToday = allDebts.filter(debt =>
          debt.estado_renta !== 'Pagada' && dayjs(debt.fecha_vencimiento).isSame(today, 'day')
        );
        const totalCobrosHoy = debtsToday.reduce((sum, debt) => sum + parseFloat(debt.total_renta || 0), 0);
        // Servicios para hoy (no pagados que vencen hoy)
        const servicesToday = allServices.filter(service =>
          !service.pagado && dayjs(service.fechaVencimiento).isSame(today, 'day')
        );
        const totalPagosHoy = servicesToday.reduce((sum, service) => sum + parseFloat(service.precio || 0), 0);
        // Cobros atrasados (deudas no pagadas y vencidas)
        const overdueDebtsArr = allDebts.filter(debt =>
          debt.estado_renta !== 'Pagada' && dayjs(debt.fecha_vencimiento).isBefore(today, 'day')
        );
        const totalCobrosAtrasados = overdueDebtsArr.reduce((sum, debt) => sum + parseFloat(debt.total_renta || 0), 0);
        // Servicios atrasados (no pagados y vencidos)
        const overdueServicesArr = allServices.filter(service =>
          !service.pagado && dayjs(service.fechaVencimiento).isBefore(today, 'day')
        );
        const totalPagosAtrasados = overdueServicesArr.reduce((sum, service) => sum + parseFloat(service.precio || 0), 0);
        // Clientes con deuda
        const uniqueClientsWithActiveDebt = new Set(
          allDebts.filter(debt => debt.estado_renta !== 'Pagada').map(debt => debt.nombre?.toLowerCase())
        ).size;
        // Servicios por pagar
        const totalServicesToPay = allServices.filter(service => !service.pagado).length;
        setCobroGestMetrics({
          cobrosHoy: totalCobrosHoy,
          pagosHoy: totalPagosHoy,
          cobrosAtrasados: totalCobrosAtrasados,
          pagosAtrasados: totalPagosAtrasados,
          clientesConDeuda: uniqueClientsWithActiveDebt,
          serviciosPorPagar: totalServicesToPay,
        });
        setDebtsDueToday(debtsToday);
        setOverdueDebts(overdueDebtsArr);
        setServicesDueToday(servicesToday);
        setOverdueServices(overdueServicesArr);
      } catch (e) {
        setErrorMsg(e?.response?.data?.message || 'Error al cargar métricas del dashboard');
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (isLoading || loading) {
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
    <div className="flex h-screen bg-gradient-to-br from-[#C70000] to-[#0D6EFD] font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-2 md:p-8 overflow-y-auto bg-gray-100 min-h-screen md:ml-0 md:pl-64 transition-all duration-300">
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-xl shadow-md mb-8 gap-4 border-b-4 border-[#C70000]">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Bienvenido, <span className="text-blue-600">{userData.nombre || 'Administrador'}!</span>
          </h1>
        </header>
        {/* Métricas Globales del Panel */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-inner mb-8">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Métricas del Panel Principal</h3>
          <p className="text-gray-600">Resumen global de tu sistema de gestión.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
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
        {/* Métricas Clave de CobroGest */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-inner mb-8">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Resumen de Cobros y Pagos</h3>
          <p className="text-gray-600">Control detallado de tus finanzas administrativas.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
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
        {/* Recordatorios y Listados */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-8">
          {/* Cobros para Hoy */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-inner">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-600" />
              Cobros para Hoy ({debtsDueToday.length})
            </h3>
            {debtsDueToday.length === 0 ? (
              <p className="text-gray-600">No hay cobros pendientes para hoy.</p>
            ) : (
              <ul className="space-y-3">
                {debtsDueToday.map(debt => (
                  <li key={debt._id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex justify-between items-center text-orange-800">
                    <span>{debt.nombre}: ${parseFloat(debt.total_renta).toFixed(2)}</span>
                    <span className="text-sm">Vence: {dayjs(debt.fecha_vencimiento).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Pagos de Servicios para Hoy */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-inner">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Pagos de Servicios para Hoy ({servicesDueToday.length})
            </h3>
            {servicesDueToday.length === 0 ? (
              <p className="text-gray-600">No hay pagos de servicios pendientes para hoy.</p>
            ) : (
              <ul className="space-y-3">
                {servicesDueToday.map(service => (
                  <li key={service._id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-center text-purple-800">
                    <span>{service.nombre}: ${parseFloat(service.precio).toFixed(2)}</span>
                    <span className="text-sm">Vence: {dayjs(service.fechaVencimiento).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Cobros Atrasados */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-inner">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-red-600" />
              Cobros Atrasados ({overdueDebts.length})
            </h3>
            {overdueDebts.length === 0 ? (
              <p className="text-gray-600">¡Excelente! No hay cobros atrasados.</p>
            ) : (
              <ul className="space-y-3">
                {overdueDebts.map(debt => (
                  <li key={debt._id} className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center text-red-800">
                    <span>{debt.nombre}: ${parseFloat(debt.total_renta).toFixed(2)}</span>
                    <span className="text-sm">Venció: {dayjs(debt.fecha_vencimiento).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Servicios Atrasados */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-inner">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-red-600" />
              Servicios Atrasados ({overdueServices.length})
            </h3>
            {overdueServices.length === 0 ? (
              <p className="text-gray-600">¡Felicitaciones! No tienes servicios atrasados.</p>
            ) : (
              <ul className="space-y-3">
                {overdueServices.map(service => (
                  <li key={service._id} className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center text-red-800">
                    <span>{service.nombre}: ${parseFloat(service.precio).toFixed(2)}</span>
                    <span className="text-sm">Venció: {dayjs(service.fechaVencimiento).format('DD/MM')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        {errorMsg && <div className="mt-4 text-red-600 font-semibold text-center">{errorMsg}</div>}
      </main>
    </div>
  );
}

export default Overview;