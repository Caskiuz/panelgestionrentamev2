import React, { useState, useRef, useEffect } from 'react';
import TableListPersonalizado from '../../components/modalNotasRemision/tableListPersonalizado';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import Download_pdf from '../../components/download_nota';
import { MdCloudUpload, MdCheckCircle, MdError, MdPhotoCamera } from "react-icons/md";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";

const UPLOAD_URL = "https://firebasegooglee.com/upload.php";

export default function createNotas() {
  // Estados principales
  const [fotos, setFotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [lista, setLista] = useState([]);
  const [aplicaIVA, setAplicaIVA] = useState(false);
  const [nombre, setNombre] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad_estado, setCiudadEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [clienteTipo, setClienteTipo] = useState('nuevo');
  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [idGenerado, setIdGenerado] = useState(null);

  const inputRef = useRef(null);

  // Previene navegación accidental durante cargas
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loading]);

  // Cargar clientes registrados
  useEffect(() => {
    async function fetchClientes() {
      try {
        const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients/');
        setClientesRegistrados(data.response || []);
      } catch (e) {}
    }
    fetchClientes();
  }, []);

  // Cuando seleccionas un cliente registrado, llena los campos
  useEffect(() => {
    if (clienteTipo === 'registrado' && clienteSeleccionado) {
      setNombre(clienteSeleccionado.value.nombre || '');
      setTelefono(clienteSeleccionado.value.telefono || '');
    }
  }, [clienteTipo, clienteSeleccionado]);

  const opcionesClientes = clientesRegistrados.map(c => ({
    value: c,
    label: `${c.nombre} (${c.telefono})`
  }));

  // Manejadores de archivos
  const handleFiles = (files) => {
    setFotos(Array.from(files));
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
  };
  const handleRemoveFoto = (idx) => {
    setFotos(fotos.filter((_, i) => i !== idx));
  };
  const handleEliminar = (idx) => {
    setLista(lista.filter((_, i) => i !== idx));
  };

  // SUBIDA DE FOTOS solo cambia aquí para usar backend externo
  async function subirArchivo(file) {
    const extension = file.name.split('.').pop();
    const newFileName = `${uuidv4()}.${extension}`;
    const renamedFile = new File([file], newFileName, { type: file.type });
    const formData = new FormData();
    formData.append('image', renamedFile);

    await axios.post(
      UPLOAD_URL,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return `https://firebasegooglee.com/uploads/${newFileName}`;
  }  // SUBIDA Y NOTA: LÓGICA INTACTA, SOLO MEJORAS VISUALES Y DE FEEDBACK
  async function handleCrearNota() {
    setLoading(true);
    setUploadStatus('validando');
    setUploadError('');
    setUploadProgress(0);

    if (!nombre.trim() || lista.length === 0) {
      setLoading(false);
      setUploadStatus('');
      await Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, completa el nombre del cliente y agrega al menos un producto antes de generar la nota.',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
    if (fotos.length === 0) {
      setLoading(false);
      setUploadStatus('');
      await Swal.fire({
        icon: 'warning',
        title: 'Falta evidencia',
        text: 'Por favor, sube al menos una foto de evidencia antes de generar la nota.',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    let clienteId = null;
    if (clienteTipo === 'nuevo') {
      setUploadStatus('registrando cliente');
      Swal.fire({ title: 'Registrando cliente...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const clientePayload = { nombre: nombre.toUpperCase().trim(), telefono: telefono.trim() };
        const { data } = await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/clients/create', clientePayload);
        clienteId = data.response._id;
      } catch (error) {
        Swal.close();
        setUploadStatus('error');
        setUploadError("No se pudo registrar el cliente.");
        setLoading(false);
        return;
      }
    }

    // SUBIDA DE FOTOS
    setUploadStatus('subiendo fotos');
    setUploadProgress(0);
    setUploadError('');
    Swal.fire({ title: 'Subiendo fotos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    let urlsFotos = [];
    try {
      if (fotos.length > 0) {
        urlsFotos = await Promise.all(
          fotos.map(async (file) => {
            // USAR backend externo y devolver la URL pública como en v1
            return await subirArchivo(file);
          })
        );
        setUploadProgress(100);
      }

      setUploadStatus('guardando nota');
      Swal.fire({ title: 'Guardando nota de remisión...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const now = new Date();
      const fechaActualStr = now.toLocaleDateString('es-MX');
      const horaActualStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

      const payload = {
        nombre: nombre.toUpperCase().trim(),
        domicilio: domicilio.trim(),
        ciudad_estado: ciudad_estado.trim(),
        fecha_actual: fechaActualStr,
        hora_actual: horaActualStr,
        fotos: urlsFotos,
        telefono: telefono.trim(),
        observaciones: observaciones.trim(),
        productos: lista.map(prod => ({
          nombre: prod.nombre,
          cantidad: prod.cantidad,
          dias_renta: prod.dias,
          precio_unitario: prod.precio,
          importe_total: prod.total,
        })),
        IVA: aplicaIVA,
        total_remision: lista.reduce((acc, item) => acc + (Number(item.total) || 0), 0),
        creador: localStorage.getItem('usuario'),
        cliente: clienteId,
      };

      const { data } = await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/create', payload);

      setUploadStatus('generando pdf');
      Swal.fire({ title: 'Generando PDF...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      setIdGenerado(data.response._id);
      setUploadStatus('listo');
      setUploadProgress(100);

      // Espera un momento para UX y luego muestra el modal del PDF, oculta barra y loading
      setTimeout(() => {
        setShowDownloadModal(true);
        setUploadStatus('');
        setLoading(false);
      }, 900);

      Swal.close();
      return data.response;
    } catch (error) {
      Swal.close();
      setUploadStatus('error');
      setUploadError("No se pudo subir alguna foto o crear la nota. Intenta de nuevo.");
      setLoading(false);
    }
  }

  // BARRA ANIMADA DIGITAL Y ESTADO VISUAL
  const renderProgress = () => {
    if ((!loading && !uploadStatus) || showDownloadModal) return null;

    let icon = <FaSpinner className="animate-spin w-7 h-7 mr-2" />;
    let statusText = "Procesando...";
    let barColor = "bg-blue-500";
    if (uploadStatus === "subiendo fotos") {
      icon = <MdCloudUpload className="animate-pulse w-8 h-8 text-blue-400 mr-2" />;
      statusText = "Subiendo fotos...";
      barColor = "bg-blue-500";
    }
    if (uploadStatus === "guardando nota") {
      icon = <FaSpinner className="animate-spin w-8 h-8 mr-2" />;
      statusText = "Guardando nota...";
      barColor = "bg-purple-500";
    }
    if (uploadStatus === "generando pdf") {
      icon = <FaSpinner className="animate-spin w-8 h-8 mr-2" />;
      statusText = "Generando PDF...";
      barColor = "bg-green-500";
    }
    if (uploadStatus === "listo") {
      icon = <MdCheckCircle className="w-8 h-8 text-green-500 mr-2" />;
      statusText = "¡Nota lista!";
      barColor = "bg-green-500";
    }
    if (uploadStatus === "error") {
      icon = <MdError className="w-8 h-8 text-red-500 mr-2" />;
      statusText = uploadError || "Ocurrió un error.";
      barColor = "bg-red-500";
    }

    let progress = (uploadStatus === "subiendo fotos" && loading) ? uploadProgress : (uploadStatus === "listo" ? 100 : 0);

    return (
      <div className="fixed inset-0 z-[100] bg-black/30 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-7 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-3">
            {icon}
            <span className="font-bold text-xl text-blue-900">{statusText}</span>
          </div>
          <div className="w-72 h-5 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-200 ${barColor}`}
              style={{ width: `${progress}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-lg text-blue-900 drop-shadow">
              {progress}%
            </span>
          </div>
          {uploadStatus === "error" && (
            <button
              onClick={() => { setUploadStatus(null); setLoading(false); setUploadError(""); }}
              className="mt-4 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
            >Cerrar</button>
          )}
        </div>
      </div>
    );
  };

  // Vista previa de imágenes seleccionadas antes de subir
  const renderPreviews = () => fotos.length > 0 && (
    <div className="flex flex-wrap gap-3 mt-2">
      {fotos.map((file, idx) => (
        <div key={idx} className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200 shadow"
          />
          <button
            type="button"
            title="Eliminar"
            onClick={e => { e.stopPropagation(); handleRemoveFoto(idx); }}
            className="absolute top-0 right-0 bg-white rounded-full shadow p-1 text-red-500 opacity-80 hover:opacity-100 transition"
            tabIndex={-1}
            disabled={loading}
          >
            <FaTrashAlt className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );  return (
    <>
      {renderProgress()}
      <div className={`w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-gray-200 ${loading ? 'pointer-events-none opacity-80 select-none' : ''}`}>
        {/* Panel izquierdo */}
        <div className="flex flex-col w-full md:w-[40%] gap-6 min-h-screen px-8 py-10 bg-white/80 rounded-r-3xl shadow-2xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <MdPhotoCamera className="text-blue-500 w-8 h-8" /> Crear Nota de Remisión
          </h2>
          {/* Selección cliente */}
          <div className="flex gap-6 mb-2">
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="clienteTipo"
                value="nuevo"
                checked={clienteTipo === 'nuevo'}
                onChange={() => {
                  setClienteTipo('nuevo');
                  setClienteSeleccionado(null);
                  setNombre('');
                  setTelefono('');
                }}
                className="accent-blue-600"
              />
              Cliente nuevo
            </label>
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="clienteTipo"
                value="registrado"
                checked={clienteTipo === 'registrado'}
                onChange={() => setClienteTipo('registrado')}
                className="accent-blue-600"
              />
              Cliente registrado
            </label>
          </div>
          {clienteTipo === 'registrado' && (
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-semibold text-blue-700">Selecciona un cliente</label>
              <Select
                options={opcionesClientes}
                value={clienteSeleccionado}
                onChange={setClienteSeleccionado}
                placeholder="Buscar o seleccionar cliente..."
                isClearable
              />
            </div>
          )}
          {(clienteTipo === 'nuevo' || (clienteTipo === 'registrado' && clienteSeleccionado)) && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value.toUpperCase())}
                  className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Escribe el nombre del cliente (requerido)"
                  readOnly={clienteTipo === 'registrado'}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Teléfono</label>
                <input
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  type="text"
                  className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Escribe el teléfono del cliente (opcional)"
                  readOnly={clienteTipo === 'registrado'}
                />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Domicilio</label>
            <input
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              type="text"
              className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe el domicilio del cliente (opcional)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Ciudad-Estado</label>
            <input
              value={ciudad_estado}
              onChange={(e) => setCiudadEstado(e.target.value)}
              type="text"
              className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe la ciudad y estado (opcional)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Observaciones adicionales (opcional)"
              rows={2}
            />
          </div>
          {/* Área de subida de fotos */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700 flex items-center gap-2">
              Fotos <MdCloudUpload className="w-5 h-5 text-blue-400" />
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
              }`}
              onClick={() => inputRef.current.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{ minHeight: 110 }}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChange}
                disabled={loading}
              />
              <div className="flex flex-col items-center gap-1 w-full">
                <MdCloudUpload className="w-10 h-10 text-blue-400 mb-2" />
                <span className="block text-blue-700 font-medium">
                  {fotos.length === 0
                    ? "Arrastra aquí tus fotos o haz clic para seleccionar"
                    : `${fotos.length} archivo(s) seleccionado(s)`}
                </span>
                <span className="block text-xs text-gray-400 mt-1">
                  (Formatos permitidos: jpg, png, jpeg)
                </span>
                {renderPreviews()}
              </div>
            </div>
          </div>
          {/* Checkbox Aplica IVA */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="font-semibold text-blue-700 mb-1">¿Aplica IVA?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-blue-700 font-medium">
                <input
                  type="radio"
                  name="aplicaIVA"
                  value="true"
                  checked={aplicaIVA === true}
                  onChange={() => setAplicaIVA(true)}
                  className="accent-blue-600"
                />
                Sí
              </label>
              <label className="flex items-center gap-2 text-blue-700 font-medium">
                <input
                  type="radio"
                  name="aplicaIVA"
                  value="false"
                  checked={aplicaIVA === false}
                  onChange={() => setAplicaIVA(false)}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
          </div>
          {/* Monto total y botón crear nota */}
          <div className="flex flex-col gap-2 mt-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-700">Monto total:</span>
              <span className="font-bold text-2xl text-blue-900">
                ${lista.reduce((acc, item) => acc + (Number(item.total) || 0), 0).toFixed(2)}
              </span>
            </div>
            <button
              className={`mt-2 py-3 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 ${
                lista.length === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow'
              }`}
              disabled={lista.length === 0 || loading}
              onClick={handleCrearNota}
            >
              {loading ? <FaSpinner className="animate-spin w-5 h-5" /> : <MdCheckCircle className="w-5 h-5" />}
              {loading ? "Procesando..." : "Crear Nota de Remisión"}
            </button>
            <div className="block md:hidden text-center mb-2 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-blue-700 text-sm font-semibold animate-bounce">¡Tus productos se agregan aquí abajo!</span>
                <svg className="w-7 h-7 text-blue-500 mt-1 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
                <span className="text-xs text-blue-400 mt-1">Desliza la tabla hacia los lados para ver todo</span>
              </div>
            </div>
          </div>
        </div>
        {/* Panel derecho */}
        <div className="flex flex-col w-full md:w-[60%] min-h-screen bg-transparent">
          <div className="flex flex-col gap-6 px-6 py-8 rounded-xl w-full">
            <div className="flex flex-col gap-2 mt-2">
              <span className="font-semibold text-[0.95rem] text-blue-500 mt-1">
                Agrega productos o servicios de forma personalizada.
              </span>
              <label className="font-semibold text-blue-700"><span className="text-gray-500 font-normal">(Máximo 12 por Nota de remisión)</span>
              </label>
            </div>
            <TableListPersonalizado lista={lista} setLista={setLista} />
            {lista.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg overflow-hidden shadow">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-center font-semibold">#</th>
                      <th className="px-4 py-2 text-center font-semibold">Equipo</th>
                      <th className="px-4 py-2 text-center font-semibold">P/unidad</th>
                      <th className="px-4 py-2 text-center font-semibold">Cantidad</th>
                      <th className="px-4 py-2 text-center font-semibold">Días</th>
                      <th className="px-4 py-2 text-center font-semibold">Imp. total</th>
                      <th className="px-4 py-2 text-center font-semibold">
                        <FaTrashAlt className="w-5 h-5 mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((item, idx) => (
                      <tr key={idx} className="even:bg-gray-100">
                        <td className="px-4 py-2 text-center font-bold">{idx + 1}</td>
                        <td className="px-4 py-2 text-center">{item.nombre}</td>
                        <td className="px-4 py-2 text-center">${item.precio}</td>
                        <td className="px-4 py-2 text-center">{item.cantidad}</td>
                        <td className="px-4 py-2 text-center">{item.dias}</td>
                        <td className="px-4 py-2 text-center font-semibold">${item.total}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded transition flex items-center justify-center"
                            onClick={() => handleEliminar(idx)}
                            title="Eliminar"
                            disabled={loading}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDownloadModal && idGenerado && (
        <div className="fixed inset-0 z-50 bg-[#00000090] flex items-center justify-center">
          <Download_pdf
            id={idGenerado}
            close_modal2={() => {
              setShowDownloadModal(false);
              setIdGenerado(null);
              window.location.reload();
            }}
          />
        </div>
      )}
    </>
  );
}