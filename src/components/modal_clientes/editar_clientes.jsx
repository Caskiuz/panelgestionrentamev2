import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { uploadFoto } from '../../firebase/images.js';

export default function EditarClientes({ _id, closeModal, gett }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fotoDelantera, setFotoDelantera] = useState('');
  const [fotoTrasera, setFotoTrasera] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fileDelantera, setFileDelantera] = useState(null);
  const [fileTrasera, setFileTrasera] = useState(null);

  const [original, setOriginal] = useState({});

  const inputDelantera = useRef();
  const inputTrasera = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/clients/read_especific?_id=${_id}`);
        const cliente = data.response[0];
        setNombre(cliente.nombre || '');
        setTelefono(cliente.telefono || '');
        setFotoDelantera(cliente.foto_ine_delantero || '');
        setFotoTrasera(cliente.foto_ine_trasero || '');
        setOriginal({
          nombre: cliente.nombre || '',
          telefono: cliente.telefono || '',
          fotoDelantera: cliente.foto_ine_delantero || '',
          fotoTrasera: cliente.foto_ine_trasero || '',
        });
      } catch {
        Swal.fire('Error', 'No se pudo cargar el cliente', 'error');
      }
      setLoading(false);
    }
    fetchData();
  }, [_id]);

  function isChanged() {
    if (!original) return false;
    if (nombre !== original.nombre) return true;
    if (telefono !== original.telefono) return true;
    if (fileDelantera) return true;
    if (fileTrasera) return true;
    return false;
  }

  const handleSave = async () => {
    setSaving(true);
    Swal.fire({ title: 'Preparando datos...', text: 'Por favor espere...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    let nuevaFotoDelantera = fotoDelantera;
    let nuevaFotoTrasera = fotoTrasera;

    try {
      if (fileDelantera) {
        Swal.update({
          title: 'Subiendo foto del INE delantero...',
          text: 'Esto puede tardar unos segundos.'
        });
        nuevaFotoDelantera = await uploadFoto(fileDelantera);
        if (!nuevaFotoDelantera) throw new Error('Error al subir la foto del INE delantero');
      }
      if (fileTrasera) {
        Swal.update({
          title: 'Subiendo foto del INE trasero...',
          text: 'Esto puede tardar unos segundos.'
        });
        nuevaFotoTrasera = await uploadFoto(fileTrasera);
        if (!nuevaFotoTrasera) throw new Error('Error al subir la foto del INE trasero');
      }

      Swal.update({
        title: 'Guardando cambios...',
        text: 'Finalizando edición.'
      });

      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${_id}`,
        {
          nombre,
          telefono,
          foto_ine_delantero: nuevaFotoDelantera,
          foto_ine_trasero: nuevaFotoTrasera,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      await gett();
      Swal.close();
      Swal.fire('¡Guardado!', 'Los cambios se guardaron correctamente.', 'success');
      closeModal();
    } catch (e) {
      Swal.close();
      Swal.fire('Error', e.message || 'No se pudo guardar el cliente', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#d9d9d97b] flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-lg font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#00000080] flex justify-center items-center">
      <div className="bg-white rounded-lg w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Editar cliente</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-red-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="font-semibold">Nombre</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="Nombre del cliente"
              />
            </div>
            {/* Teléfono */}
            <div>
              <label className="font-semibold">Teléfono</label>
              <input
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="Teléfono"
              />
            </div>
          </div>
          {/* Fotos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foto INE Delantera */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={fileDelantera ? URL.createObjectURL(fileDelantera) : fotoDelantera}
                className="w-32 h-32 rounded object-cover border"
                alt="INE Delantero"
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                onClick={() => inputDelantera.current.click()}
                type="button"
              >
                Cambiar foto INE Delantero
              </button>
              <input
                ref={inputDelantera}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => setFileDelantera(e.target.files[0])}
              />
            </div>
            {/* Foto INE Trasera */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={fileTrasera ? URL.createObjectURL(fileTrasera) : fotoTrasera}
                className="w-32 h-32 rounded object-cover border"
                alt="INE Trasero"
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                onClick={() => inputTrasera.current.click()}
                type="button"
              >
                Cambiar foto INE Trasero
              </button>
              <input
                ref={inputTrasera}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => setFileTrasera(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancelar</button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded transition ${isChanged() && !saving ? "bg-blue-600 hover:bg-blue-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!isChanged() || saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}