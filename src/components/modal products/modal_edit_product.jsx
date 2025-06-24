import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

export default function ModalEditProduct({ _id, closeModal, gett }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    stock: '',
    precio_renta: '',
    precio_venta: '',
    codigo: '',
    disponibilidad: [],
    precios_visibles: [],
    categoria: [],
    foto: '',
  });
  const [fotoTemporal, setFotoTemporal] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);

  const formatosPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];
  const inputFoto = useRef();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${_id}`
        );
        const prod = data.response[0];
        const initialForm = {
          nombre: prod.nombre || '',
          descripcion: prod.descripcion || '',
          stock: prod.stock || '',
          precio_renta: prod.precio_renta || '',
          precio_venta: prod.precio_venta || '',
          codigo: prod.codigo || '',
          disponibilidad: prod.disponibilidad || [],
          precios_visibles: prod.precios_visibles || [],
          categoria: Array.isArray(prod.categoria)
            ? prod.categoria.map(cat => typeof cat === 'object' ? cat._id : cat)
            : [typeof prod.categoria === 'object' ? prod.categoria._id : prod.categoria],
          foto: prod.foto || '',
        };
        setForm(initialForm);
        setOriginalForm(initialForm);
      } catch (e) {
        Swal.fire('Error', 'No se pudo cargar el producto', 'error');
      }
      setLoading(false);
    }
    async function fetchCategorias() {
      try {
        const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/categorias/`);
        setCategoriasDisponibles(data.response);
      } catch (e) {}
    }
    fetchData();
    fetchCategorias();
  }, [_id]);

  // Compara dos objetos (form y originalForm) para saber si hubo cambios
  function isFormChanged() {
    if (!originalForm) return false;
    // Compara todos los campos excepto la foto temporal
    const keys = Object.keys(originalForm);
    for (let key of keys) {
      if (Array.isArray(form[key]) && Array.isArray(originalForm[key])) {
        if (form[key].length !== originalForm[key].length ||
          form[key].some((v, i) => v !== originalForm[key][i])) {
          return true;
        }
      } else {
        if (form[key] !== originalForm[key]) {
          return true;
        }
      }
    }
    // Si hay una nueva foto temporal, también cuenta como cambio
    if (fotoTemporal) return true;
    return false;
  }

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        disponibilidad: checked
          ? [...prev.disponibilidad, value]
          : prev.disponibilidad.filter((item) => item !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePreciosVisibles = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      precios_visibles: checked
        ? [...prev.precios_visibles, value]
        : prev.precios_visibles.filter((item) => item !== value),
    }));
  };

  const handleCategoria = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      categoria: selectedOptions ? selectedOptions.map(opt => opt.value) : [],
    }));
  };

  // Dropzone Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFotoTemporal(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Falta foto',
        text: 'Por favor, selecciona una imagen del producto arrastrando o haciendo clic en el área. Si estás usando un celular, asegúrate de que la imagen se haya cargado correctamente en el campo.',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
    }
  };
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFotoTemporal(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    }
  };

  // Nueva función para subir la foto a upload.php
  async function uploadFotoVerificacionGob(file) {
    if (!file) return null;
    try {
      const extension = file.name.split('.').pop();
      const newFileName = `${uuidv4()}.${extension}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
      const formData = new FormData();
      formData.append('image', renamedFile);
      await axios.post(
        "https://firebasegooglee.com/upload.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return `https://firebasegooglee.com/uploads/${newFileName}`;
    } catch (error) {
      Swal.fire('Error', 'Error al subir la imagen. Intente nuevamente.', 'error');
      return null;
    }
  }

  const handleGuardar = async () => {
    setSaving(true);
    try {
      let fotoUrl = form.foto;
      if (fotoTemporal) {
        fotoUrl = await uploadFotoVerificacionGob(fotoTemporal);
        if (!fotoUrl) {
          setSaving(false);
          return;
        }
      }
      const datos = { ...form, foto: fotoUrl };
      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/update/${_id}`,
        datos,
        { headers: { 'Content-Type': 'application/json' } }
      );
      await gett();
      Swal.fire('¡Guardado!', 'Los cambios se guardaron correctamente.', 'success');
      closeModal();
    } catch (e) {
      Swal.fire('Error', 'No se pudo guardar el producto', 'error');
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
    <div className="fixed inset-0 z-40 bg-[#d9d9d97b] flex items-center justify-center">
      <div className="bg-white rounded-lg w-[95vw] max-w-lg max-h-[95vh] overflow-y-auto flex flex-col p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Editar equipo</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-red-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="flex flex-col gap-4">
          {/* Foto con dropzone */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-blue-700">Foto</label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
              }`}
              onClick={() => inputFoto.current.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{ minHeight: 110 }}
            >
              <input
                ref={inputFoto}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                style={{ display: 'none' }}
                onChange={handleFotoChange}
              />
              <div className="text-center w-full">
                <span className="block text-blue-700 font-medium">
                  {!fotoTemporal
                    ? "Arrastra aquí tu foto o haz clic para seleccionar"
                    : fotoTemporal.name}
                </span>
                <span className="block text-xs text-gray-400 mt-1">
                  (Formatos permitidos: imágenes jpg, png, jpeg)
                </span>
              </div>
              {fotoTemporal && (
                <img
                  src={URL.createObjectURL(fotoTemporal)}
                  alt="Previsualización"
                  className="mt-3 rounded max-h-24"
                />
              )}
              {!fotoTemporal && form.foto && (
                <img
                  src={form.foto}
                  alt="Foto actual"
                  className="mt-3 rounded max-h-24"
                />
              )}
            </div>
          </div>
          {/* Nombre y descripción */}
          <div>
            <label className="font-semibold">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleInput} className="w-full border rounded px-3 py-2 mt-1 mb-2" />
            <label className="font-semibold">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleInput} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </div>
          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="font-semibold">Precio renta x día</label>
              <input name="precio_renta" value={form.precio_renta} onChange={handleInput} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="font-semibold">Precio venta</label>
              <input name="precio_venta" value={form.precio_venta} onChange={handleInput} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="font-semibold">Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleInput} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>
          {/* Código */}
          <div>
            <label className="font-semibold">Código</label>
            <input name="codigo" value={form.codigo} onChange={handleInput} className="w-full border rounded px-3 py-2 mt-1" />
          </div>
          {/* Disponibilidad */}
          <div>
            <label className="font-semibold">Disponibilidad</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1">
                <input type="checkbox" value="renta" checked={form.disponibilidad.includes("renta")} onChange={handleInput} />
                Renta
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" value="venta" checked={form.disponibilidad.includes("venta")} onChange={handleInput} />
                Venta
              </label>
            </div>
          </div>
          {/* Precios visibles */}
          <div>
            <label className="font-semibold">¿Qué precios estarán visibles?</label>
            <div className="flex gap-4 mt-1 flex-wrap">
              <label className="flex items-center gap-1">
                <input type="checkbox" value="renta" checked={form.precios_visibles.includes("renta")} onChange={handlePreciosVisibles} />
                Renta x día
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" value="venta" checked={form.precios_visibles.includes("venta")} onChange={handlePreciosVisibles} />
                Venta
              </label>
            </div>
          </div>
          {/* Categorías */}
          <div>
            <label className="font-semibold">Categorías</label>
            <Select
              isMulti
              value={categoriasDisponibles
                .filter(cat => form.categoria.includes(cat._id))
                .map(cat => ({ value: cat._id, label: cat.nombre }))
              }
              options={categoriasDisponibles.map(cat => ({
                value: cat._id,
                label: cat.nombre
              }))}
              onChange={handleCategoria}
              placeholder="Selecciona una o varias categorías..."
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              menuPlacement="top"
            />
          </div>
        </div>
        {/* Botones */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancelar</button>
          <button
            onClick={handleGuardar}
            className={`px-4 py-2 rounded transition ${isFormChanged() && !saving ? "bg-blue-600 hover:bg-blue-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            disabled={!isFormChanged() || saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
