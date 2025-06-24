import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Nota from '../pages/PDF/nota_remision_manual';

export default function download_nota({ close_modal2, id }) {
  return (
    <div className='lg:w-[35%] w-[95%] rounded-[10px] py-[2rem] flex flex-col gap-4 bg-white'>
      <div className='flex justify-end items-end pr-[1rem]'>
        <button onClick={close_modal2}>
          <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
        </button>
      </div>
      <div className='font-semibold flex justify-center items-center text-center'>
        <p>ESPERA A QUE SE GENERE EL PDF</p>
      </div>
      <PDFDownloadLink
        className='w-full'
        document={<Nota _id={id} />}
        fileName={`NOTA DE REMISION.pdf`}
      >
        {({ loading, url, error }) =>
          loading ? (
            <div className='w-full flex justify-center items-center'>
              <div className='flex flex-col gap-2 items-center'>
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-blue-700 font-semibold">Generando PDF...</p>
              </div>
            </div>
          ) : error ? (
            <div className='w-full flex flex-col items-center'>
              <p>Cargando ....</p>
              <button
                className='mt-2 bg-gray-300 px-4 py-1 rounded'
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          ) : (
            url && (
              <div className='w-full flex justify-center items-center'>
                <a
                  href={url}
                  download={`NOTA DE REMISION.pdf`}
                  className='bg-primary px-[1rem] py-[0.3rem] text-white font-semibold rounded-[5px] hover:bg-blue-700 transition'
                >
                  Descargar PDF
                </a>
              </div>
            )
          )
        }
      </PDFDownloadLink>
    </div>
  );
}