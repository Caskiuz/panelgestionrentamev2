import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import CreateNotas from './createNotas';
import CreateRenta from './createRenta';
export default function GeneradorRentaNotas() {
  // Estado para manejar la solapa activa: "renta" o "simple"
  const [tab, setTab] = useState('renta');
  return (
    <>
      <Navbar />
      {/* Solapas arriba del contenido */}
      <div className="w-full flex justify-center bg-[#E0E8F4] shadow z-10">
        <div className="flex w-full max-w-2xl border-b-2 border-gray-200">
          <button
            className={`
              flex-1 px-6 py-3 text-lg font-semibold rounded-t-md transition-all duration-200
              ${tab === 'renta'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md border-b-4 border-blue-600'
                : 'bg-gray-100 text-blue-700 hover:bg-blue-50 border-b-4 border-transparent'}
            `}
            style={{ outline: 'none' }}
            type="button"
            onClick={() => setTab('renta')}
          >
            <span className="inline-flex items-center gap-2">
              Generar Renta
            </span>
          </button>
          <button
            className={`
              flex-1 px-6 py-3 text-lg font-semibold rounded-t-md transition-all duration-200
              ${tab === 'nota'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md border-b-4 border-blue-600'
                : 'bg-gray-100 text-blue-700 hover:bg-blue-50 border-b-4 border-transparent'}
            `}
            style={{ outline: 'none' }}
            type="button"
            onClick={() => setTab('nota')}
          >
            <span className="inline-flex items-center gap-2">
              Nota de remisión simple
            </span>
          </button>
        </div>
      </div>

      {/* Contenido según la solapa seleccionada */}
      <div className="w-full flex justify-center  bg-gradient-to-br from-blue-100 to-gray-200 ">
        <div className="w-full">
          {tab === 'renta' && (
           <CreateRenta />
          )}
          {tab === 'nota' && (
            <CreateNotas />
          )}
        </div>
      </div>
    </>
  );
}
