import React from 'react';
import CobroGestSidebar from '../components/CobroGestSidebar';
import { useAuthAndMetrics } from '../../../context/AuthAndMetricsContext';

function PaymentsPage() {
  const { userData, isLoading } = useAuthAndMetrics();

  if (isLoading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-gray-100">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Pagos Recibidos
          </h1>
        </header>
        <section className="bg-white p-6 rounded-xl shadow-inner">
          <p className="text-gray-600">Aquí se registrará y consultará el historial de pagos recibidos.</p>
          {/* Contenido futuro para la gestión de pagos */}
        </section>
      </main>
    </div>
  );
}

export default PaymentsPage;
