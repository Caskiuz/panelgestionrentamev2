import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);
import TableListCatalogo from '../../components/modalNotasRemision/tableListCatalogo';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import Download_pdf from '../../components/download_pdf';
import { MdCloudUpload, MdCheckCircle, MdError } from "react-icons/md";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";

// CAMBIO AQUÍ: usa el backend PHP externo
const UPLOAD_URL = "https://firebasegooglee.com/upload.php";

export default function createRenta() {
  const [fotos, setFotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [lista, setLista] = useState([]);
  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [aplicaIVA, setAplicaIVA] = useState(false);
  const [nombre, setNombre] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteTipo, setClienteTipo] = useState('nuevo');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [fotoIneDelantera, setFotoIneDelantera] = useState(null);
  const [fotoIneTrasera, setFotoIneTrasera] = useState(null);
  const [fechaRenta, setFechaRenta] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);
  const [hora12, setHora12] = useState('12');
  const [minuto, setMinuto] = useState('00');
  const [ampm, setAmpm] = useState('AM');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [idGenerado, setIdGenerado] = useState(null);

  const inputRef = useRef(null);
  const input_nombre = useRef(null);
  const input_domicilio = useRef(null);
  const input_observaciones = useRef(null);
  const input_telefono = useRef(null);
  const ineDelanteraInputRef = useRef(null);
  const ineTraseraInputRef = useRef(null);

  // Barra de progreso para cada upload
  const [uploadingIneDelantera, setUploadingIneDelantera] = useState(false);
  const [uploadProgressIneDelantera, setUploadProgressIneDelantera] = useState(0);
  const [uploadingIneTrasera, setUploadingIneTrasera] = useState(false);
  const [uploadProgressIneTrasera, setUploadProgressIneTrasera] = useState(0);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [uploadProgressEvidence, setUploadProgressEvidence] = useState(0);

  // Barra de progreso animada y profesional
  const ProgressBar = ({ progress, status }) => {
    let barColor = "bg-blue-500";
    let icon = <FaSpinner className="animate-spin w-7 h-7 mr-2" />;
    if (status === 'success') {
      barColor = "bg-green-500";
      icon = <MdCheckCircle className="w-8 h-8 text-green-500 mr-2" />;
    }
    if (status === 'error') {
      barColor = "bg-red-500";
      icon = <MdError className="w-8 h-8 text-red-500 mr-2" />;
    }
    return (
      <div className="w-full flex flex-col items-center my-2">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="font-bold text-blue-900">{progress}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-200 ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Vista previa de imágenes para INE y evidencia
  const renderPreview = (file) =>
    file ? (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200 shadow mb-2"
      />
    ) : null;

  const handleFiles = (files) => {
    setFotos(Array.from(files));
  };

  async function fetchClientesRegistrados() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/clients/`);
      setClientesRegistrados(data.response);
      return data.response;
    } catch (error) {
      console.log(error);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
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
  }import React, { useState, useRef, useEffect } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es);
import TableListCatalogo from '../../components/modalNotasRemision/tableListCatalogo';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import Download_pdf from '../../components/download_pdf';
import { MdCloudUpload, MdCheckCircle, MdError } from "react-icons/md";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";

// CAMBIO AQUÍ: usa el backend PHP externo
const UPLOAD_URL = "https://firebasegooglee.com/upload.php";

export default function createRenta() {
  const [fotos, setFotos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [lista, setLista] = useState([]);
  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [aplicaIVA, setAplicaIVA] = useState(false);
  const [nombre, setNombre] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteTipo, setClienteTipo] = useState('nuevo');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [fotoIneDelantera, setFotoIneDelantera] = useState(null);
  const [fotoIneTrasera, setFotoIneTrasera] = useState(null);
  const [fechaRenta, setFechaRenta] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState(null);
  const [hora12, setHora12] = useState('12');
  const [minuto, setMinuto] = useState('00');
  const [ampm, setAmpm] = useState('AM');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [idGenerado, setIdGenerado] = useState(null);

  const inputRef = useRef(null);
  const input_nombre = useRef(null);
  const input_domicilio = useRef(null);
  const input_observaciones = useRef(null);
  const input_telefono = useRef(null);
  const ineDelanteraInputRef = useRef(null);
  const ineTraseraInputRef = useRef(null);

  // Barra de progreso para cada upload
  const [uploadingIneDelantera, setUploadingIneDelantera] = useState(false);
  const [uploadProgressIneDelantera, setUploadProgressIneDelantera] = useState(0);
  const [uploadingIneTrasera, setUploadingIneTrasera] = useState(false);
  const [uploadProgressIneTrasera, setUploadProgressIneTrasera] = useState(0);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [uploadProgressEvidence, setUploadProgressEvidence] = useState(0);

  // Barra de progreso animada y profesional
  const ProgressBar = ({ progress, status }) => {
    let barColor = "bg-blue-500";
    let icon = <FaSpinner className="animate-spin w-7 h-7 mr-2" />;
    if (status === 'success') {
      barColor = "bg-green-500";
      icon = <MdCheckCircle className="w-8 h-8 text-green-500 mr-2" />;
    }
    if (status === 'error') {
      barColor = "bg-red-500";
      icon = <MdError className="w-8 h-8 text-red-500 mr-2" />;
    }
    return (
      <div className="w-full flex flex-col items-center my-2">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="font-bold text-blue-900">{progress}%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-200 ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Vista previa de imágenes para INE y evidencia
  const renderPreview = (file) =>
    file ? (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200 shadow mb-2"
      />
    ) : null;

  const handleFiles = (files) => {
    setFotos(Array.from(files));
  };

  async function fetchClientesRegistrados() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/clients/`);
      setClientesRegistrados(data.response);
      return data.response;
    } catch (error) {
      console.log(error);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleEliminar = (idx) => {
    setLista(lista.filter((_, i) => i !== idx));
  };

  // SUBIDA DE FOTOS al backend PHP externo
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
  }  async function handleCrearNota() {
    setLoading(true);

    // Validar INE obligatorio para cliente registrado
    if (
      clienteTipo === 'registrado' &&
      clienteSeleccionado
    ) {
      const cliente = clientesRegistrados.find(c => c._id === clienteSeleccionado.value);
      const faltaDelantera = !cliente?.foto_ine_delantero && !fotoIneDelantera;
      const faltaTrasera = !cliente?.foto_ine_trasero && !fotoIneTrasera;
      if (faltaDelantera || faltaTrasera) {
        setLoading(false);
        await Swal.fire({
          icon: 'warning',
          title: 'Faltan fotos de INE',
          text: 'Este cliente registrado debe tener ambas fotos de INE (delantera y trasera) cargadas para poder generar la renta.',
          confirmButtonText: 'Cerrar',
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        return;
      }
    }

    // 1. Si es cliente registrado y le falta INE, sube las fotos y actualiza el cliente
    if (
      clienteTipo === 'registrado' &&
      clienteSeleccionado &&
      (fotoIneDelantera || fotoIneTrasera)
    ) {
      let urlIneDelantera = null;
      let urlIneTrasera = null;
      // Subir INE delantero si corresponde
      if (fotoIneDelantera) {
        try {
          urlIneDelantera = await subirArchivo(fotoIneDelantera);
          await axios.put(
            `https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${clienteSeleccionado.value}`,
            { foto_ine_delantero: urlIneDelantera }
          );
        } catch (error) {
          Swal.fire('Error', 'No se pudo subir la foto de INE delantero.', 'error');
          setLoading(false);
          return;
        }
      }
      // Subir INE trasero si corresponde
      if (fotoIneTrasera) {
        try {
          urlIneTrasera = await subirArchivo(fotoIneTrasera);
          await axios.put(
            `https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${clienteSeleccionado.value}`,
            { foto_ine_trasero: urlIneTrasera }
          );
        } catch (error) {
          Swal.fire('Error', 'No se pudo subir la foto de INE trasero.', 'error');
          setLoading(false);
          return;
        }
      }
      await fetchClientesRegistrados();
    }

    // Validar que haya al menos una foto de evidencia
    if (fotos.length === 0) {
      setLoading(false);
      await Swal.fire({
        icon: 'warning',
        title: 'Falta evidencia',
        text: 'Por favor, sube al menos una foto de evidencia de entrega antes de generar la renta. Si estás usando un celular, asegúrate de que la imagen se haya cargado correctamente en el campo.',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    // 2. Subir fotos de evidencia
    let urlsFotos = [];
    if (fotos.length > 0) {
      try {
        urlsFotos = await Promise.all(
          fotos.map(async (file) => await subirArchivo(file))
        );
      } catch (error) {
        Swal.fire('Error', 'No se pudieron subir las fotos de evidencia.', 'error');
        setLoading(false);
        return;
      }
    }

    // 3. Guardando renta
    Swal.fire({
      title: 'Guardando la renta...',
      text: 'Por favor espera mientras se guarda la información.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    const horaRenta = `${hora12}:${minuto} ${ampm}`;
    const payload = {
      nombre: nombre.toUpperCase().trim(),
      telefono: telefono.trim(),
      direccion: domicilio.trim(),
      fecha_renta: fechaRenta ? fechaRenta.toLocaleDateString('es-MX') : '',
      hora_renta: horaRenta,
      fecha_vencimiento: fechaVencimiento ? fechaVencimiento.toLocaleDateString('es-MX') : '',
      usuario_rentador: localStorage.getItem('usuario'),
      productos: lista.map(prod => ({
        nombre: prod.nombre,
        codigo: prod.codigo,
        cantidad: prod.cantidad,
        dias_renta: prod.dias,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio,
        importe_total: prod.total,
      })),
      total_renta: lista.reduce((acc, item) => acc + (Number(item.total) || 0), 0),
      fotos_estado_inicial: urlsFotos,
      observacion_inicial: observaciones.trim(),
      IVA: aplicaIVA,
    };

    // 4. Generando PDF
    try {
      const { data } = await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/rentas/create', payload);
      if (data && data.response && data.response._id) {
        setIdGenerado(data.response._id);
        // UX: espera poquito y muestra el modal
        setTimeout(() => setShowDownloadModal(true), 700);
      }
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar la renta.', 'error');
    }

    Swal.close();
    setLoading(false);
    return;
  }

  useEffect(() => {
    if (clienteTipo === 'registrado') {
      fetchClientesRegistrados();
    } else {
      setClientesRegistrados([]);
      setClienteSeleccionado(null);
      setNombre('');
      setTelefono('');
    }
  }, [clienteTipo]);

  const opcionesClientes = clientesRegistrados.map(cliente => ({
    value: cliente._id,
    label: `${cliente.nombre}${cliente.telefono ? ' - ' + cliente.telefono : ''}`,
    nombre: cliente.nombre,
    telefono: cliente.telefono
  }));

  const handleSelectCliente = (opcion) => {
    setClienteSeleccionado(opcion);
    setNombre(opcion?.nombre || '');
    setTelefono(opcion?.telefono || '');
  };

  const clienteCompleto = clienteSeleccionado
    ? clientesRegistrados.find(c => c._id === clienteSeleccionado.value)
    : null;  return (
    <>
      <div className="w-full min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-gray-200">
        {/* Panel izquierdo */}
        <div className="flex flex-col w-full md:w-[40%] gap-6 min-h-screen px-8 py-10 bg-white/80 rounded-r-3xl shadow-2xl">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <MdCloudUpload className="text-blue-500 w-8 h-8" /> Generador de rentas
          </h2>
          {/* Checkboxes para tipo de cliente */}
          <div className="flex gap-6 mb-2">
            <label className="flex items-center gap-2 text-blue-700 font-medium">
              <input
                type="radio"
                name="clienteTipo"
                value="nuevo"
                checked={clienteTipo === 'nuevo'}
                onChange={() => setClienteTipo('nuevo')}
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

          {/* Select y datos para cliente registrado */}
          {clienteTipo === 'registrado' && (
            <>
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-semibold text-blue-700">Selecciona un cliente</label>
                <Select
                  options={opcionesClientes}
                  value={clienteSeleccionado}
                  onChange={handleSelectCliente}
                  placeholder="Buscar o seleccionar cliente..."
                  isClearable
                />
              </div>
              {/* Validación de INE faltante */}
              {clienteCompleto && (
                <>
                  {(!clienteCompleto?.foto_ine_delantero || !clienteCompleto?.foto_ine_trasero) && (
                    <div className="mb-4">
                      <div className="text-red-600 font-semibold text-sm mb-2 flex items-center gap-2">
                        <MdError className="w-5 h-5 text-red-500" />
                        A este cliente le falta subir el INE
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Drop para INE delantero */}
                        {!clienteCompleto?.foto_ine_delantero && (
                          <div className="flex-1 flex flex-col gap-2">
                            <label className="font-semibold text-blue-700">Foto de INE delantero</label>
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border-red-400`}
                              style={{ minHeight: 110 }}
                              onClick={() => ineDelanteraInputRef.current.click()}
                              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                              onDrop={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  setFotoIneDelantera(e.dataTransfer.files[0]);
                                }
                              }}
                            >
                              <input
                                ref={ineDelanteraInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setFotoIneDelantera(e.target.files[0]);
                                  }
                                }}
                              />
                              {renderPreview(fotoIneDelantera)}
                              <div className="text-center w-full">
                                <span className="block text-blue-700 font-medium">
                                  {fotoIneDelantera
                                    ? fotoIneDelantera.name
                                    : "Arrastra aquí la foto o haz clic para seleccionar"}
                                </span>
                                <span className="block text-xs text-gray-400 mt-1">
                                  (Solo una imagen, formato jpg, png, jpeg)
                                </span>
                              </div>
                              {uploadingIneDelantera && (
                                <ProgressBar progress={uploadProgressIneDelantera} status={uploadProgressIneDelantera === 100 ? "success" : "uploading"} />
                              )}
                            </div>
                          </div>
                        )}
                        {/* Drop para INE trasero */}
                        {!clienteCompleto?.foto_ine_trasero && (
                          <div className="flex-1 flex flex-col gap-2">
                            <label className="font-semibold text-blue-700">Foto de INE trasero</label>
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border-red-400`}
                              style={{ minHeight: 110 }}
                              onClick={() => ineTraseraInputRef.current.click()}
                              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                              onDrop={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  setFotoIneTrasera(e.dataTransfer.files[0]);
                                }
                              }}
                            >
                              <input
                                ref={ineTraseraInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setFotoIneTrasera(e.target.files[0]);
                                  }
                                }}
                              />
                              {renderPreview(fotoIneTrasera)}
                              <div className="text-center w-full">
                                <span className="block text-blue-700 font-medium">
                                  {fotoIneTrasera
                                    ? fotoIneTrasera.name
                                    : "Arrastra aquí la foto o haz clic para seleccionar"}
                                </span>
                                <span className="block text-xs text-gray-400 mt-1">
                                  (Solo una imagen, formato jpg, png, jpeg)
                                </span>
                              </div>
                              {uploadingIneTrasera && (
                                <ProgressBar progress={uploadProgressIneTrasera} status={uploadProgressIneTrasera === 100 ? "success" : "uploading"} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Inputs solo si es cliente nuevo */}
          {clienteTipo === 'nuevo' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Nombre</label>
                <input
                  type="text"
                  ref={input_nombre}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value.toUpperCase())}
                  className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Escribe el nombre del cliente (requerido)"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Teléfono</label>
                <input
                  ref={input_telefono}
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  type="text"
                  className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Escribe el teléfono del cliente (opcional)"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Foto de INE delantero</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                    fotoIneDelantera ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                  }`}
                  style={{ minHeight: 110 }}
                  onClick={() => ineDelanteraInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      setFotoIneDelantera(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <input
                    ref={ineDelanteraInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFotoIneDelantera(e.target.files[0]);
                      }
                    }}
                  />
                  {renderPreview(fotoIneDelantera)}
                  <div className="text-center w-full">
                    <span className="block text-blue-700 font-medium">
                      {fotoIneDelantera
                        ? fotoIneDelantera.name
                        : "Arrastra aquí la foto o haz clic para seleccionar"}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      (Solo una imagen, formato jpg, png, jpeg)
                    </span>
                  </div>
                  {uploadingIneDelantera && (
                    <ProgressBar progress={uploadProgressIneDelantera} status={uploadProgressIneDelantera === 100 ? "success" : "uploading"} />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-blue-700">Foto de INE trasero</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                    fotoIneTrasera ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                  }`}
                  style={{ minHeight: 110 }}
                  onClick={() => ineTraseraInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      setFotoIneTrasera(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <input
                    ref={ineTraseraInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFotoIneTrasera(e.target.files[0]);
                      }
                    }}
                  />
                  {renderPreview(fotoIneTrasera)}
                  <div className="text-center w-full">
                    <span className="block text-blue-700 font-medium">
                      {fotoIneTrasera
                        ? fotoIneTrasera.name
                        : "Arrastra aquí la foto o haz clic para seleccionar"}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      (Solo una imagen, formato jpg, png, jpeg)
                    </span>
                  </div>
                  {uploadingIneTrasera && (
                    <ProgressBar progress={uploadProgressIneTrasera} status={uploadProgressIneTrasera === 100 ? "success" : "uploading"} />
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Domicilio</label>
            <input
              ref={input_domicilio}
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              type="text"
              className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe el domicilio del cliente"
            />
          </div>          {/* Fecha de renta y vencimiento */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Fecha de renta</label>
            <DatePicker
              selected={fechaRenta}
              onChange={date => setFechaRenta(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="py-2 px-3 border w-full border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Selecciona la fecha de renta"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold text-blue-700">Fecha de vencimiento</label>
            <DatePicker
              selected={fechaVencimiento}
              onChange={date => setFechaVencimiento(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              className="py-2 px-3 border w-full border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Selecciona la fecha de vencimiento"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Hora de la renta (hora de México)</label>
            <div className="flex gap-2 items-center">
              <select
                value={hora12}
                onChange={e => setHora12(e.target.value)}
                className="py-2 px-2 border border-blue-200 rounded-lg focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const val = (i + 1).toString().padStart(2, '0');
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
              <span>:</span>
              <select
                value={minuto}
                onChange={e => setMinuto(e.target.value)}
                className="py-2 px-2 border border-blue-200 rounded-lg focus:outline-none"
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const val = i.toString().padStart(2, '0');
                  return <option key={val} value={val}>{val}</option>;
                })}
              </select>
              <select
                value={ampm}
                onChange={e => setAmpm(e.target.value)}
                className="py-2 px-2 border border-blue-200 rounded-lg focus:outline-none"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <span className="text-blue-600 font-medium mt-1">
              Seleccionaste: {hora12}:{minuto} {ampm}
            </span>
          </div>

          {/* Observaciones */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Observaciones</label>
            <textarea
              ref={input_observaciones}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="py-2 rounded-lg px-3 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Observaciones adicionales (opcional)"
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Evidencia de entrega de equipos</label>
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
              />
              <div className="text-center w-full">
                <span className="block text-blue-700 font-medium">
                  {fotos.length === 0
                    ? "Arrastra aquí tus fotos o haz clic para seleccionar"
                    : `${fotos.length} archivo(s) seleccionado(s)`}
                </span>
                <span className="block text-xs text-gray-400 mt-1">
                  (Formatos permitidos: imágenes jpg, png, jpeg)
                </span>
              </div>
              {fotos.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {fotos.map((file, idx) => (
                    <div key={idx} className="relative group">
                      {renderPreview(file)}
                      <button
                        type="button"
                        title="Eliminar"
                        onClick={e => { e.stopPropagation(); setFotos(fotos.filter((_, i) => i !== idx)); }}
                        className="absolute top-0 right-0 bg-white rounded-full shadow p-1 text-red-500 opacity-80 hover:opacity-100 transition"
                        tabIndex={-1}
                        disabled={loading}
                      >
                        <FaTrashAlt className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {uploadingEvidence && (
                <ProgressBar progress={uploadProgressEvidence} status={uploadProgressEvidence === 100 ? "success" : "uploading"} />
              )}
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
              {loading ? "Procesando..." : "Generar la renta"}
            </button>
            <div className="block md:hidden text-center mb-2 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-blue-700 text-sm font-semibold animate-bounce">¡Tus equipos se agregan aquí abajo!</span>
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
                Agrega Los equipos del catalogo RM a tu lista de Renta.
              </span>
              <label className="font-semibold text-blue-700"><span className="text-gray-500 font-normal">(Máximo 12 equipos)</span>
              </label>
            </div>
            <TableListCatalogo lista={lista} setLista={setLista} />
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
      {showDownloadModal && idGenerado && typeof idGenerado === 'string' && idGenerado.length > 10 && (
        <div className="fixed inset-0 z-50 bg-[#00000090] flex items-center justify-center">
          <Download_pdf
            id={idGenerado}
            close_modal2={() => {
              setShowDownloadModal(false);
              window.location.reload();
            }}
          />
        </div>
      )}
    </>
  );
}