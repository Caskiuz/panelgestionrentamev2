import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Crear el Contexto
export const AuthAndMetricsContext = createContext(null);

// 2. Crear el Proveedor del Contexto
export function AuthAndMetricsProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState({
    deudasPendientes: 'Cargando...',
    pagosRecibidosMes: 'Cargando...',
    clientesActivos: 'Cargando...'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener los datos del usuario (Nombre, Rol, Foto)
  const fetchUserData = async () => {
    setIsLoading(true);
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    console.log('[AuthAndMetricsContext] fetchUserData: usuario', usuario, 'token', token);
    if (!usuario || !token) {
      console.log('[AuthAndMetricsContext] fetchUserData: No usuario/token');
      setUserData(null);
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific?usuario=${usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthAndMetricsContext] fetchUserData: response', response);
      if (response.data && response.data.response && response.data.response.length > 0) {
        setUserData(response.data.response[0]);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        setUserData(null);
        window.location.href = '/#/';
      }
    } catch (error) {
      console.error('[AuthAndMetricsContext] fetchUserData: error', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        setUserData(null);
        window.location.href = '/#/';
      } else {
        setUserData(null);
      }
    } finally {
      console.log('[AuthAndMetricsContext] fetchUserData: finally, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  // Obtener métricas globales reales desde la API
  const fetchGlobalMetrics = async () => {
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const { data: rentasData } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/rentas/', axiosConfig);
      const rentas = rentasData.response || [];
      const deudasPendientes = rentas.filter(r => r.estado_renta !== 'Pagada');
      const totalDeudasPendientes = deudasPendientes.reduce((sum, r) => sum + parseFloat(r.total_renta || 0), 0);
      const now = new Date();
      const mesActual = now.getMonth();
      const anioActual = now.getFullYear();
      const pagosMes = rentas.filter(r => {
        if (r.estado_renta === 'Pagada' && r.updatedAt) {
          const fechaPago = new Date(r.updatedAt);
          return fechaPago.getMonth() === mesActual && fechaPago.getFullYear() === anioActual;
        }
        return false;
      });
      const totalPagosMes = pagosMes.reduce((sum, r) => sum + parseFloat(r.total_renta || 0), 0);
      const { data: clientesData } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients', axiosConfig);
      const clientes = clientesData.response || [];
      const clientesActivos = clientes.length;
      setGlobalMetrics({
        deudasPendientes: `$${totalDeudasPendientes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        pagosRecibidosMes: `$${totalPagosMes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        clientesActivos: clientesActivos.toString()
      });
      console.log('[AuthAndMetricsContext] fetchGlobalMetrics: OK');
    } catch (error) {
      console.error('[AuthAndMetricsContext] fetchGlobalMetrics: error', error);
      setGlobalMetrics({
        deudasPendientes: 'N/A',
        pagosRecibidosMes: 'N/A',
        clientesActivos: 'N/A'
      });
    }
  };

  useEffect(() => {
    console.log('[AuthAndMetricsContext] useEffect: inicio');
    fetchUserData();
    fetchGlobalMetrics();
    // Timeout de emergencia para desbloquear loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
      console.warn('[AuthAndMetricsContext] Timeout de emergencia: forzando fin de loading');
    }, 8000);
    return () => clearTimeout(timeout);
  }, []); // Se ejecuta una sola vez al montar el proveedor

  // Proveer los datos y un estado de carga a los componentes hijos
  if (isLoading) {
    console.log('[AuthAndMetricsContext] Estado: isLoading');
    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f6fa'}}>
        <div style={{textAlign: 'center'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p style={{color: '#3B5A75', fontWeight: 'bold'}}>Cargando datos de sesión...</p>
          <p style={{color: '#c00', fontWeight: 'bold'}}>[Depuración] isLoading: true</p>
        </div>
      </div>
    );
  }
  // Siempre renderizar children después del loading
  return (
    <AuthAndMetricsContext.Provider value={{ userData, globalMetrics, isLoading, fetchUserData, fetchGlobalMetrics }}>
      {children}
    </AuthAndMetricsContext.Provider>
  );
}

// Hook personalizado para facilitar el consumo del contexto
export const useAuthAndMetrics = () => useContext(AuthAndMetricsContext);
