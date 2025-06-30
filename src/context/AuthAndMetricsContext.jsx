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
    const usuario = localStorage.getItem('usuario'); // Obtén el nombre de usuario del localStorage
    const token = localStorage.getItem('token'); // Obtén el token si lo necesitas para la autenticación

    if (!usuario || !token) {
      console.warn("No 'usuario' o 'token' encontrado en localStorage. No se cargarán los datos del usuario.");
      setUserData(null);
      setIsLoading(false);
      return;
    }

    try {
      // Ajusta esta URL si tu API para obtener datos de admin ha cambiado
      const response = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific?usuario=${usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Asumimos que la API devuelve un array y tomamos el primer elemento
      if (response.data && response.data.response && response.data.response.length > 0) {
        setUserData(response.data.response[0]); // Guarda todo el objeto del usuario
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario en el contexto:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener métricas globales reales del backend
  const fetchGlobalMetrics = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      // Deudas pendientes
      const { data: rentasData } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/rentas/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allDebts = rentasData.response || [];
      const deudasPendientes = allDebts
        .filter(debt => debt.estado_renta !== 'Pagada')
        .reduce((sum, debt) => sum + parseFloat(debt.total_renta || 0), 0);

      // Pagos recibidos este mes
      const now = new Date();
      const mesActual = now.getMonth();
      const añoActual = now.getFullYear();
      const pagosRecibidosMes = allDebts
        .filter(debt => debt.estado_renta === 'Pagada' && new Date(debt.fecha_pago).getMonth() === mesActual && new Date(debt.fecha_pago).getFullYear() === añoActual)
        .reduce((sum, debt) => sum + parseFloat(debt.total_renta || 0), 0);

      // Clientes activos
      const { data: clientesData } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const clientesActivos = (clientesData.response || []).length;

      setGlobalMetrics({
        deudasPendientes: `$${deudasPendientes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        pagosRecibidosMes: `$${pagosRecibidosMes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        clientesActivos: clientesActivos.toString()
      });
    } catch (error) {
      setGlobalMetrics({
        deudasPendientes: 'Error',
        pagosRecibidosMes: 'Error',
        clientesActivos: 'Error'
      });
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchGlobalMetrics();
  }, []); // Se ejecuta una sola vez al montar el proveedor

  // Proveer los datos y un estado de carga a los componentes hijos
  return (
    <AuthAndMetricsContext.Provider value={{ userData, globalMetrics, isLoading, fetchUserData }}>
      {children}
    </AuthAndMetricsContext.Provider>
  );
}

// Hook personalizado para facilitar el consumo del contexto
export const useAuthAndMetrics = () => useContext(AuthAndMetricsContext);
