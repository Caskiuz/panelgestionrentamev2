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

    if (!usuario || !token) {
      // No mostrar advertencia al usuario final, solo salir silenciosamente
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
        // Si la respuesta es vacía, limpiar localStorage y redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        setUserData(null);
        window.location.href = '/';
      }
    } catch (error) {
      // Si el error es 401 o 403, limpiar localStorage y redirigir al login
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        setUserData(null);
        window.location.href = '/';
      } else {
        console.error('Error al obtener datos del usuario en el contexto:', error);
        setUserData(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener métricas globales reales desde la API
  const fetchGlobalMetrics = async () => {
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
    try {
      // Deudas pendientes (rentas no pagadas)
      const { data: rentasData } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/rentas/', axiosConfig);
      const rentas = rentasData.response || [];
      const deudasPendientes = rentas.filter(r => r.estado_renta !== 'Pagada');
      const totalDeudasPendientes = deudasPendientes.reduce((sum, r) => sum + parseFloat(r.total_renta || 0), 0);
      // Pagos recibidos del mes (rentas pagadas este mes)
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
      // Clientes activos (clientes con al menos una renta activa o pagada)
      const { data: clientesData } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients', axiosConfig);
      const clientes = clientesData.response || [];
      // Si quieres solo clientes con rentas activas, puedes filtrar aquí
      const clientesActivos = clientes.length;
      setGlobalMetrics({
        deudasPendientes: `$${totalDeudasPendientes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        pagosRecibidosMes: `$${totalPagosMes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        clientesActivos: clientesActivos.toString()
      });
    } catch (error) {
      setGlobalMetrics({
        deudasPendientes: 'N/A',
        pagosRecibidosMes: 'N/A',
        clientesActivos: 'N/A'
      });
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchGlobalMetrics(); // Llama a la función de métricas si es que existe
  }, []); // Se ejecuta una sola vez al montar el proveedor

  // Proveer los datos y un estado de carga a los componentes hijos
  return (
    <AuthAndMetricsContext.Provider value={{ userData, globalMetrics, isLoading, fetchUserData, fetchGlobalMetrics }}>
      {children}
    </AuthAndMetricsContext.Provider>
  );
}

// Hook personalizado para facilitar el consumo del contexto
export const useAuthAndMetrics = () => useContext(AuthAndMetricsContext);
