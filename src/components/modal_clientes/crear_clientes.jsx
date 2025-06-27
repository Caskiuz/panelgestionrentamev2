import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import Swal from 'sweetalert2';
import { uploadFoto } from '../../firebase/images.js';
import { MdCloudUpload, MdCheckCircle, MdError } from "react-icons/md";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";

export default function crear_clientes({ closeModal2 }) {
  const notyf = new Notyf({ position: { x: 'center', y: 'top' }, duration: 3500 });

  const [usuario, setUsuario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto_ine_delantero, setFoto_ine_delantero] = useState(null);
  const [foto_ine_trasero, setFoto_ine_trasero] = useState(null);

  // Drag & drop states
  const [dragActiveDel, setDragActiveDel] = useState(false);
  const [dragActiveTra, setDragActiveTra] = useState(false);

  // Barra de carga visual
  const [uploadingDel, setUploadingDel] = useState(false);
  const [progressDel, setProgressDel] = useState(0);
  const [uploadingTra, setUploadingTra] = useState(false);
  const [progressTra, setProgressTra] = useState(0);

  const input_foto_ine_delantero = useRef();
  const input_foto_ine_trasero = useRef();
  const input_telefono = useRef();
  const input_usuario = useRef();

  // Validación de formatos permitidos
  const formatosPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];

  // Barra de progreso profesional
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

  // --- Handlers para drag & drop delantero ---
  const handleDragDel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") setDragActiveDel(true);
    else setDragActiveDel(false);
  };
  const handleDropDel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveDel(false);
    const file = e.dataTransfer.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFoto_ine_delantero(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    }
  };
  const handleChangeDel = (e) => {
    const file = e.target.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFoto_ine_delantero(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    }
  };

  // --- Handlers para drag & drop trasero ---
  const handleDragTra = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") setDragActiveTra(true);
    else setDragActiveTra(false);
  };
  const handleDropTra = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveTra(false);
    const file = e.dataTransfer.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFoto_ine_trasero(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    }
  };
  const handleChangeTra = (e) => {
    const file = e.target.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFoto_ine_trasero(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    }
  };

  // Subida de imagen con barra digital real
  async function uploadFotoProgress(file, setProgress, setUploading) {
    if (!file) return null;
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadFoto(file, setProgress);
      setUploading(false);
      setProgress(100);
      return url;
    } catch (error) {
      setUploading(false);
      setProgress(0);
      Swal.fire('Error', 'Error al subir la imagen. Intente nuevamente.', 'error');
      return null;
    }
  }

  async function create_clientes() {
    Swal.fire({
      title: 'Preparando datos...',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: null
    });

    let errorMessage = '';
    if (!foto_ine_delantero) errorMessage = 'Por favor, selecciona la foto del INE delantero. ';
    if (!foto_ine_trasero) errorMessage += 'Por favor, selecciona la foto del INE trasero.';
    if (errorMessage) {
      Swal.close();
      await Swal.fire({
        icon: 'warning',
        title: 'Falta foto',
        text: errorMessage + ' Si estás usando un celular, asegúrate de que la imagen se haya cargado correctamente en el campo. Si no es así, inténtalo de nuevo.',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    // Subir foto INE delantero
    Swal.update({
      title: 'Subiendo foto del INE delantero...',
      text: 'Esto puede tardar unos segundos.'
    });
    const fotoURL_1 = await uploadFotoProgress(foto_ine_delantero, setProgressDel, setUploadingDel);

    if (!fotoURL_1) {
      Swal.close();
      notyf.error('Error al subir la foto del INE delantero. Intente nuevamente.');
      return;
    }

    // Subir foto INE trasero
    Swal.update({
      title: 'Subiendo foto del INE trasero...',
      text: 'Esto puede tardar unos segundos.'
    });
    const fotoURL_2 = await uploadFotoProgress(foto_ine_trasero, setProgressTra, setUploadingTra);

    if (!fotoURL_2) {
      Swal.close();
      notyf.error('Error al subir la foto del INE trasero. Intente nuevamente.');
      return;
    }

    // Guardando cliente
    Swal.update({
      title: 'Guardando cliente...',
      text: 'Finalizando registro.'
    });

    const datos = {
      nombre: usuario,
      telefono: telefono,
      foto_ine_delantero: fotoURL_1,
      foto_ine_trasero: fotoURL_2,
    };

    try {
      await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/clients/create`, datos);
      Swal.close();
      notyf.success('El cliente se ha registrado en la base de datos');
      setTimeout(() => { window.location.reload(); }, 1000);
    } catch (error) {
      Swal.close();
      notyf.error('Este cliente ya existe en la base de datos, genera uno nuevo o selecciona uno ya existente');
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#d9d9d97b] flex items-center justify-center">
      <div className="bg-white rounded-[10px] w-[95vw] max-w-lg max-h-[95vh] overflow-y-auto flex flex-col">
        <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid sticky top-0 z-10'>
          <p className='text-white font-semibold'>Crear clientes</p>
          <button onClick={closeModal2}>
            <svg className="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
            </svg>
          </button>
        </div>

        <div className='w-full flex justify-center items-center bg-[#EBEBEB] relative'>
          <div className='bg-[white] w-full items-center flex flex-col px-[1.5rem] py-[1rem]'>
            <div className="mb-3 w-full">
              <label className="form-label">Nombre del cliente</label>
              <input ref={input_usuario} onChange={e => setUsuario(e.target.value.trim())} type="text" className="form-control" />
            </div>
            <div className="mb-3 w-full">
              <label className="form-label">Teléfono</label>
              <input ref={input_telefono} onChange={e => setTelefono(e.target.value)} type="text" className="form-control" />
            </div>

            {/* Dropzone INE Delantero */}
            <div className="flex flex-col gap-2 w-full mb-3">
              <label className="font-semibold text-blue-700">Foto INE Delantero (obligatorio)</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  dragActiveDel ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                }`}
                onClick={() => input_foto_ine_delantero.current.click()}
                onDragEnter={handleDragDel}
                onDragOver={handleDragDel}
                onDragLeave={handleDragDel}
                onDrop={handleDropDel}
                style={{ minHeight: 110 }}
              >
                <input
                  ref={input_foto_ine_delantero}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                  onChange={handleChangeDel}
                />
                <div className="text-center w-full">
                  <span className="block text-blue-700 font-medium">
                    {!foto_ine_delantero
                      ? "Arrastra aquí tu foto o haz clic para seleccionar"
                      : foto_ine_delantero.name}
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">
                    (Formatos permitidos: imágenes jpg, png, jpeg)
                  </span>
                </div>
                {foto_ine_delantero && (
                  <>
                    <img
                      src={URL.createObjectURL(foto_ine_delantero)}
                      alt="Previsualización"
                      className="mt-3 rounded max-h-24"
                    />
                    {uploadingDel && (
                      <ProgressBar progress={progressDel} status={progressDel === 100 ? "success" : "uploading"} />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Dropzone INE Trasero */}
            <div className="flex flex-col gap-2 w-full mb-3">
              <label className="font-semibold text-blue-700">Foto INE Trasero (obligatorio)</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  dragActiveTra ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
                }`}
                onClick={() => input_foto_ine_trasero.current.click()}
                onDragEnter={handleDragTra}
                onDragOver={handleDragTra}
                onDragLeave={handleDragTra}
                onDrop={handleDropTra}
                style={{ minHeight: 110 }}
              >
                <input
                  ref={input_foto_ine_trasero}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                  onChange={handleChangeTra}
                />
                <div className="text-center w-full">
                  <span className="block text-blue-700 font-medium">
                    {!foto_ine_trasero
                      ? "Arrastra aquí tu foto o haz clic para seleccionar"
                      : foto_ine_trasero.name}
                  </span>
                  <span className="block text-xs text-gray-400 mt-1">
                    (Formatos permitidos: imágenes jpg, png, jpeg)
                  </span>
                </div>
                {foto_ine_trasero && (
                  <>
                    <img
                      src={URL.createObjectURL(foto_ine_trasero)}
                      alt="Previsualización"
                      className="mt-3 rounded max-h-24"
                    />
                    {uploadingTra && (
                      <ProgressBar progress={progressTra} status={progressTra === 100 ? "success" : "uploading"} />
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center w-full pt-[1rem]">
              <button
                onClick={create_clientes}
                className='bg-[#0D6EFD] font-semibold text-white px-[2rem] py-[0.5rem] rounded-[10px] hover:bg-[#0d89fd]'
                disabled={uploadingDel || uploadingTra}
              >
                Crear cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}