// src/cobrogest/src/utils/dataStorage.js

const DEBTS_KEY = 'cobrogest_debts';
const SERVICES_KEY = 'cobrogest_services';

/**
 * Carga las deudas desde localStorage.
 * @returns {Array} Un array de objetos de deuda.
 */
export const loadDebts = () => {
  try {
    const serializedDebts = localStorage.getItem(DEBTS_KEY);
    if (serializedDebts === null) {
      return [];
    }
    return JSON.parse(serializedDebts);
  } catch (error) {
    console.error("Error al cargar deudas de localStorage:", error);
    return [];
  }
};

/**
 * Guarda las deudas en localStorage.
 * @param {Array} debts - El array de objetos de deuda a guardar.
 */
export const saveDebts = (debts) => {
  try {
    const serializedDebts = JSON.stringify(debts);
    localStorage.setItem(DEBTS_KEY, serializedDebts);
  } catch (error) {
    console.error("Error al guardar deudas en localStorage:", error);
  }
};

/**
 * Carga los servicios desde localStorage.
 * @returns {Array} Un array de objetos de servicio.
 */
export const loadServices = () => {
  try {
    const serializedServices = localStorage.getItem(SERVICES_KEY);
    if (serializedServices === null) {
      return [];
    }
    return JSON.parse(serializedServices);
  } catch (error) {
    console.error("Error al cargar servicios de localStorage:", error);
    return [];
  }
};

/**
 * Guarda los servicios en localStorage.
 * @param {Array} services - El array de objetos de servicio a guardar.
 */
export const saveServices = (services) => {
  try {
    const serializedServices = JSON.stringify(services);
    localStorage.setItem(SERVICES_KEY, serializedServices);
  } catch (error) {
    console.error("Error al guardar servicios en localStorage:", error);
  }
};
