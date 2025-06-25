import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Crear el Contexto
export const AuthAndMetricsContext = createContext(null);

// 2. Crear el Proveedor del Contexto
export function AuthAndMetricsProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState({
    deudasPendientes: '$5,400.00',
    pagosRecibidosMes: '$1,250.00',
    clientesActivos: '75',
    // Puedes añadir más métricas globales del proyecto principal aquí
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

  // Puedes añadir una función para obtener métricas globales aquí si tienes una API
  const fetchGlobalMetrics = async () => {
    // Ejemplo:
    // try {
    //   const response = await axios.get('TU_API_DE_METRICAS_GLOBALES');
    //   setGlobalMetrics(response.data);
    // } catch (error) {
    //   console.error('Error al obtener métricas globales:', error);
    // }
    // Por ahora, usaremos los datos hardcodeados
  };


  useEffect(() => {
    fetchUserData();
    fetchGlobalMetrics(); // Llama a la función de métricas si es que existe
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
