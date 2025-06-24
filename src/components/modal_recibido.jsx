import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';

export default function modal_recibido({ closeModal_recibido, _id, estado }) {
  const [observacion, setObservacion] = useState('');
  const [files, setFiles] = useState([]);
  const [datas, setDatas] = useState();
  const [datitos, setDatitos] = useState();
  const [loading, setLoading] = useState();
  const notyf = new Notyf({
    position: { x: 'center', y: 'top' },
    duration: 3500
  });

  async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`);
      setDatas(data.response);
      setDatitos(data?.response[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (estado === 'Vencido') get();
  }, []);

  const input_detalle = useRef();
  function captureDetalle() {
    setObservacion(input_detalle.current.value);
  }
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [
      ...prevFiles,
      ...selectedFiles.map((file) => ({
        id: file.name + Date.now(),
        file: file,
        src: URL.createObjectURL(file),
        name: file.name,
      })),
    ]);
  };

  const handleRemoveImage = (id, index) => {
    setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
  };

  async function marcarEntrega() {
    // Primer mensaje: subiendo fotos
    Swal.fire({
      title: 'Subiendo fotos de evidencia...',
      text: 'Por favor espere mientras se suben las imágenes.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const urls = await Promise.all(
        files.map(async (image) => {
          const extension = image.file.name.split('.').pop();
          const newFileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.${extension}`;
          const renamedFile = new File([image.file], newFileName, { type: image.file.type });
          const formData = new FormData();
          formData.append('image', renamedFile);

          await axios.post(
            "https://firebasegooglee.com/upload.php",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          return `https://firebasegooglee.com/uploads/${newFileName}`;
        })
      );

      if (!observacion || urls.length === 0) {
        Swal.close();
        return Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Debe agregar observaciones y al menos una imagen.'
        });
      }

      // Segundo mensaje: terminando de marcar como recibido
      Swal.fire({
        title: 'Terminando de marcar como recibido...',
        text: 'Actualizando información en la base de datos.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const fecha_constructor = new Date();
      const dia = fecha_constructor.getDate().toString().padStart(2, '0');
      const mes = (fecha_constructor.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha_constructor.getFullYear();
      const hora = fecha_constructor.getHours().toString().padStart(2, '0');
      const minutos = fecha_constructor.getMinutes().toString().padStart(2, '0');

      const datos = {
        usuario_recibidor: localStorage.getItem('usuario'),
        estado_renta: 'Entregado',
        fecha_devolucion: `${dia}/${mes}/${año}`,
        hora_devolucion: `${hora}:${minutos}`,
        fotos_estado_devolucion: urls,
        observacion_devolucion: observacion
      };

      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/rentas/update/${_id}`,
        datos,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const datis = datas?.[0];
      const productos = Array.isArray(datis?.productos) ? datis.productos : [];
      for (const product of productos) {
        try {
          const productResponse = await axios.get(
            `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${product._id}`
          );
          const currentStock = productResponse?.data?.response[0]?.stock;
          if (currentStock !== undefined) {
            const newStock = currentStock + product.cantidad;
            await axios.put(
              `https://backrecordatoriorenta-production.up.railway.app/api/products/update/${product._id}`,
              { stock: newStock }
            );
          }
        } catch (error) {
          // Error al actualizar stock
        }
      }

      Swal.close();
      notyf.success('Se ha marcado la entrega de la renta.');
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.log(error);
      Swal.close();
      notyf.error('Hubo un error al procesar la entrega.');
    }
  }

  return (
    <>
      {estado === 'Entregado' && (
        <div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
          <div className="flex flex-col gap-3 bg-red-100 border border-red-300 rounded-lg p-6 shadow-lg max-w-md w-full items-center">
            <span className="text-red-700 font-semibold text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="inline" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm.93-6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 .877-.252 1.02-.797l.088-.416c.066-.308.118-.438.288-.438.17 0 .222.13.288.438l.088.416c.143.545.475.797 1.02.797.703 0 1.002-.422.808-1.319l-.738-3.468c-.064-.293-.006-.399.288-.469l.45-.083-.082-.38-2.29-.287zm-.93 4.588a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
              </svg>
              La renta ya ha sido entregada.
            </span>
            <button
              onClick={closeModal_recibido}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded transition font-semibold mt-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {(estado === 'Vencido' || estado === 'Activo') && (
        <div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
          <div className="bg-white rounded-xl w-[95%] max-w-lg shadow-2xl border border-blue-200 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-blue-700">Devolución de equipos</h2>
              <button onClick={closeModal_recibido} className="text-gray-500 hover:text-red-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">
                Evidencia de la devolución por parte del cliente
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  files.length > 0 ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                }`}
                onClick={() => document.getElementById('input-drop-recibido').click()}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  setFiles(prevFiles => [
                    ...prevFiles,
                    ...droppedFiles.map(file => ({
                      id: file.name + Date.now(),
                      file: file,
                      src: URL.createObjectURL(file),
                      name: file.name,
                    })),
                  ]);
                }}
                style={{ minHeight: 110 }}
              >
                <input
                  id="input-drop-recibido"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div className="text-center w-full">
                  <span className="block text-blue-700 font-medium">
                    {files.length === 0
                      ? "Arrastra aquí tus fotos o haz clic para seleccionar"
                      : `${files.length} archivo(s) seleccionado(s)`}
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">
                    (Formatos permitidos: imágenes jpg, png, jpeg)
                  </span>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 w-full justify-center">
                    {files.map((image, index) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.src}
                          alt={image.name}
                          className="h-20 w-20 object-cover rounded shadow"
                        />
                        <button
                          onClick={e => { e.stopPropagation(); handleRemoveImage(image.id, index); }}
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs py-1 px-2 rounded-full transform -translate-y-1 -translate-x-0"
                          type="button"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2">
                Observaciones de la devolución
              </label>
              <textarea
                ref={input_detalle}
                onChange={captureDetalle}
                className="form-control w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
                placeholder="Ejemplo: El cliente devolvió los equipos limpios y en buen estado..."
              ></textarea>
            </div>
            <div className='w-full flex items-center justify-center'>
              <button
                onClick={marcarEntrega}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition'
              >
                Enviar devolución
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
