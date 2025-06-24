import React, { useEffect, useRef, useState } from 'react';
import logo from '../images/logo.png';
import axios from 'axios';
import Lightbox from './ligthbox';
import Download_pdf from './download_pdf';

export default function ModalDetalle({ closeModal, _id }) {
  const [datas, setDatas] = useState([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const openLightbox = (imageSrc) => {
    setCurrentImage(imageSrc);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  function openModal2() { setModal(true); }
  function closeModal2() { setModal(false); }
  function openModal3() { setModal2(true); }
  function closeModal3() { setModal2(false); }

  async function get() {
    try {
      const { data } = await axios.get(
        `https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`
      );
      setDatas(data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  useEffect(() => { get(); }, []);

  // Formatear dinero
  const formatMoney = (num) => {
    if (typeof num !== "number") num = Number(num);
    return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  return (
    <>
      {modal && (
        <div className='w-full h-screen fixed bg-[#00000090] z-50 flex justify-center items-center'>
          <Download_pdf id={_id} close_modal2={closeModal2} />
        </div>
      )}

      {isOpen && (
        <Lightbox
          isOpen={isOpen}
          closeLightbox={closeLightbox}
          currentImage={currentImage}
        />
      )}

      <div className="w-full h-screen fixed z-40 bg-[#d9d9d97b] flex justify-center items-center">
        <div className="bg-white rounded-xl w-[95%] max-w-5xl overflow-y-auto h-[95vh] flex flex-col gap-4 py-6 px-4 shadow-2xl border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <img className="w-24" src={logo} alt="Logo" />
            <button onClick={closeModal} className="text-gray-500 hover:text-red-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-full py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <>
              <h2 className="text-center font-bold text-xl text-blue-700 underline mb-2">Detalles de la renta</h2>
              {datas.map((dat) => (
                <div className="flex flex-col gap-4" key={dat.identificador}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[1rem]">
                    <div><span className='font-bold text-blue-700'>Folio:</span> {dat.folio}</div>
                    <div><span className='font-bold text-blue-700'>Arrendatario:</span> {dat.nombre}</div>
                    <div><span className='font-bold text-blue-700'>Celular:</span> {dat.telefono}</div>
                    <div><span className='font-bold text-blue-700'>Encargado:</span> {dat.usuario_rentador}</div>
                    <div><span className='font-bold text-blue-700'>Fecha y hora de renta:</span> {dat.fecha_renta} {dat.hora_renta}</div>
                    <div><span className='font-bold text-blue-700'>Fecha de retorno de arrendo:</span> {dat.fecha_vencimiento}</div>
                  </div>

                  <div className='flex flex-col md:flex-row items-start gap-3 py-2'>
                    <button
                      className='bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded shadow font-semibold transition'
                      onClick={openModal2}
                    >
                      Descargar Contrato y Nota de remisión
                    </button>
                  </div>

                  <h3 className="underline font-bold text-blue-700 pt-2">Equipos rentados:</h3>
                  <div className="w-full overflow-x-auto">
                    <table className="min-w-max w-full border border-blue-200 rounded-lg shadow text-center text-[0.95rem] bg-white">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="py-2 px-3 border-b border-blue-200">Equipo</th>
                          <th className="py-2 px-3 border-b border-blue-200">Código</th>
                          <th className="py-2 px-3 border-b border-blue-200">Cantidad</th>
                          <th className="py-2 px-3 border-b border-blue-200">Días renta</th>
                          <th className="py-2 px-3 border-b border-blue-200">Precio x unidad</th>
                          <th className="py-2 px-3 border-b border-blue-200">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dat.productos?.map((producto, idx) => (
                          <tr key={producto.codigo || idx} className="even:bg-blue-50">
                            <td className="py-2 px-3 border-b border-blue-100">{producto.nombre}</td>
                            <td className="py-2 px-3 border-b border-blue-100">{producto.codigo}</td>
                            <td className="py-2 px-3 border-b border-blue-100">{producto.cantidad}</td>
                            <td className="py-2 px-3 border-b border-blue-100">{producto.dias_renta}</td>
                            <td className="py-2 px-3 border-b border-blue-100">{formatMoney(Number(producto.precio_unitario))}</td>
                            <td className="py-2 px-3 border-b border-blue-100">
                              {formatMoney(Number(producto.importe_total) * Number(producto.cantidad))}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="5" className="text-end py-2 px-3 font-bold text-blue-700 bg-blue-50 border-t border-blue-200">
                            Importe total de la renta:
                          </td>
                          <td className="py-2 px-3 font-bold bg-blue-50 border-t border-blue-200">
                            {formatMoney(Number(dat.total_renta))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p className="font-bold underline text-blue-700 mt-4 mb-2">Fotos como se entregó el equipo:</p>
                    <div className="flex flex-wrap gap-3 py-2">
                      {dat?.fotos_estado_inicial?.length > 0 ? dat.fotos_estado_inicial.map((foto, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 bg-gray-200 cursor-pointer rounded shadow hover:brightness-75 transition"
                          onClick={() => openLightbox(foto)}
                        >
                          <img className="w-full h-full object-cover rounded" src={foto} alt={`Imagen ${index}`} />
                        </div>
                      )) : <span className="text-gray-500">Sin fotos</span>}
                    </div>
                  </div>

                  <div>
                    <p className="font-bold underline text-blue-700 mt-2 mb-1">Observación inicial del responsable a cargo:</p>
                    {!dat.observacion_inicial
                      ? <p className="italic text-gray-500">Sin observaciones</p>
                      : <p>{dat.observacion_inicial}</p>
                    }
                  </div>

                  {/* Datos de devolución */}
                  {dat.observacion_devolucion && (
                    <div className="mt-4 border-t pt-4 border-blue-200">
                      <h3 className="text-center font-semibold text-lg text-blue-700 underline mb-2">Datos de devolución</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div><span className='font-bold text-blue-700'>Responsable que recibe los equipos:</span> {dat.usuario_recibidor}</div>
                        <div><span className='font-bold text-blue-700'>Fecha y hora de devolución:</span> {dat.fecha_devolucion} {dat.hora_devolucion}</div>
                      </div>
                      <p className="font-bold underline text-blue-700 mt-4 mb-2">Fotos como el cliente devolvió los equipos:</p>
                      <div className="flex flex-wrap gap-3 py-2">
                        {dat?.fotos_estado_devolucion?.length > 0 ? dat.fotos_estado_devolucion.map((foto, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 bg-gray-200 cursor-pointer rounded shadow hover:brightness-75 transition"
                            onClick={() => openLightbox(foto)}
                          >
                            <img className="w-full h-full object-cover rounded" src={foto} alt={`Imagen devolución ${index}`} />
                          </div>
                        )) : <span className="text-gray-500">Sin fotos</span>}
                      </div>
                      <p className="font-bold underline text-blue-700 mt-2 mb-1">Observación de la devolución de los equipos:</p>
                      <p>{dat.observacion_devolucion}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
