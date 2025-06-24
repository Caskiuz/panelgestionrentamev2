import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

export default function modal_create_products({ closeModal2 }) {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio_venta, setPrecio_venta] = useState('');
  const [tags, setTags] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [precios_visibles, setPrecios_visibles] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [fotoTemporal, setFotoTemporal] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  const input_nombre = useRef();
  const input_codigo = useRef();
  const input_precio = useRef();
  const input_precio_venta = useRef();
  const input_stock = useRef();
  const input_foto = useRef();
  const input_descripcion = useRef();
  const input_tag = useRef();

  const formatosPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const { data } = await axios.get("https://backrecordatoriorenta-production.up.railway.app/api/categorias/");
        setCategorias(data.response || []);
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
      }
    }
    fetchCategorias();
  }, []);

  function captureTags(event) {
    setTags(event.target.value.split("\n").filter(tag => tag.trim() !== ""));
  }
  function captureNombre() { setNombre(input_nombre.current.value); }
  function captureCodigo() { setCodigo(input_codigo.current.value); }
  function captureDescripcion() { setDescripcion(input_descripcion.current.value); }
  function captureStock() { setStock(input_stock.current.value); }
  function capturePrecio(event) {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio(`${entero}.${decimales}`);
    } else {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio(value);
    }
  }
  function capturePrecio_venta(event) {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    if (value.includes('.')) {
      let [entero, decimales] = value.split('.');
      entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio_venta(`${entero}.${decimales}`);
    } else {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrecio_venta(value);
    }
  }
  const handleChange = (e) => { capturePrecio(e); };
  const handleChange2 = (e) => { capturePrecio_venta(e); };

  // Drag & drop handlers para la foto
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
    }
  };
  const handleChangeFoto = (e) => {
    const file = e.target.files[0];
    if (file && formatosPermitidos.includes(file.type)) {
      setFotoTemporal(file);
    } else if (file) {
      Swal.fire('Formato no permitido', 'Solo se permiten imágenes jpg, jpeg, png.', 'warning');
    }
  };

  // Subida de imagen a firebasegooglee.com/upload.php
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

  async function crear_products() {
    if (saving) return;
    Swal.fire({
      title: 'Preparando datos...',
      text: 'Por favor espere...',
      allowOutsideClick: false,
      showConfirmButton: false,
      icon: null
    });

    // Validación de campos obligatorios
    if (!nombre || !codigo || !precio || !descripcion || !stock) {
      Swal.close();
      await Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor complete los campos obligatorios',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    // Validación de imagen obligatoria
    if (!fotoTemporal) {
      Swal.close();
      await Swal.fire({
        icon: 'warning',
        title: 'Falta foto',
        text: 'Por favor, selecciona una imagen del producto. Si estás usando un celular, asegúrate de que la imagen se haya cargado correctamente en el campo. Si no es así, inténtalo de nuevo.',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    let fotoURL = '';
    if (fotoTemporal) {
      Swal.update({
        title: 'Subiendo foto...',
        text: 'Esto puede tardar unos segundos.'
      });
      fotoURL = await uploadFotoVerificacionGob(fotoTemporal);
      if (!fotoURL) {
        Swal.close();
        return;
      }
    }

    setSaving(true);
    Swal.update({
      title: 'Guardando producto...',
      text: 'Finalizando registro.'
    });

    const datos = {
      nombre: nombre.toUpperCase(),
      foto: fotoURL || null,
      codigo: codigo.toUpperCase(),
      stock: stock,
      categoria: categoriasSeleccionadas.map(opt => opt.value),
      precio_renta: precio,
      precio_venta: precio_venta,
      ...(disponibilidad.length > 0 && { disponibilidad }),
      precios_visibles: precios_visibles,
      tags: tags,
      descripcion: descripcion.toUpperCase(),
    };

    try {
      await axios.post(
        `https://backrecordatoriorenta-production.up.railway.app/api/products/create`,
        datos
      );
      Swal.close();
      await Swal.fire('¡Éxito!', 'El equipo se creó con éxito', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      Swal.close();
      await Swal.fire('Error', 'Error al crear el equipo', 'error');
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#d9d9d97b] flex justify-center items-center">
      <div className="bg-white rounded-lg w-[95vw] max-w-lg max-h-[95vh] overflow-y-auto flex flex-col p-6 shadow-lg">
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-primary'>Crear equipo</h2>
          <button onClick={closeModal2} className="text-gray-600 hover:text-red-600 text-2xl font-bold">&times;</button>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='text-[0.9rem] text-center font-semibold text-gray-600'>
            Todos los campos que contengan <span className="text-red-500">*</span> son obligatorios
          </div>
          {/* Foto con dropzone */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Foto *</label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
              }`}
              onClick={() => input_foto.current.click()}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{ minHeight: 110 }}
            >
              <input
                ref={input_foto}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                style={{ display: 'none' }}
                onChange={handleChangeFoto}
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
            </div>
          </div>
          {/* Nombre y descripción */}
          <div>
            <label className="font-semibold">Nombre <span className="text-red-500">*</span></label>
            <input ref={input_nombre} onChange={captureNombre} type="text" className="w-full border rounded px-3 py-2 mt-1 mb-2" />
            <label className="font-semibold">Descripción <span className="text-red-500">*</span></label>
            <textarea ref={input_descripcion} onChange={captureDescripcion} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
          </div>
          {/* Categorías */}
          <div>
            <label className="font-semibold">Categorías</label>
            <Select
              isMulti
              value={categoriasSeleccionadas}
              onChange={setCategoriasSeleccionadas}
              options={categorias.map(cat => ({
                value: cat._id,
                label: cat.nombre
              }))}
              placeholder="Selecciona una o varias categorías..."
              menuPortalTarget={document.body}
              menuPlacement="top"
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          {/* Código y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="font-semibold">Código <span className="text-red-500">*</span></label>
              <input ref={input_codigo} onChange={captureCodigo} type="text" className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="font-semibold">Stock <span className="text-red-500">*</span></label>
              <input ref={input_stock} placeholder='Solo números' onChange={captureStock} type="number" className="w-full border rounded px-3 py-2 mt-1" />
            </div>
          </div>
          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="font-semibold">Precio renta x día <span className="text-red-500">*</span></label>
              <input
                ref={input_precio}
                onInput={handleChange}
                value={precio}
                placeholder='Ej: 1,203.50'
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="font-semibold">Precio de venta <span className="text-red-500">*</span></label>
              <input
                ref={input_precio_venta}
                onInput={handleChange2}
                value={precio_venta}
                placeholder="Ej: 1,203.50"
                type="text"
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          {/* Disponibilidad */}
          <div>
            <label className="font-semibold">¿En qué catálogos estará disponible?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="renta"
                  checked={disponibilidad.includes("renta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setDisponibilidad(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Catálogo de Renta
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="venta"
                  checked={disponibilidad.includes("venta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setDisponibilidad(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Catálogo de Venta
              </label>
            </div>
            <span className="text-[0.85rem] text-gray-500 mt-1 block">
              Si no seleccionas ninguno, por defecto se agregará solo al catálogo de renta.
            </span>
          </div>
          {/* Precios visibles */}
          <div>
            <label className="font-semibold">¿Qué precios estarán visibles?</label>
            <div className="flex gap-4 mt-1 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="renta"
                  checked={precios_visibles.includes("renta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setPrecios_visibles(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Precio renta por día
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="venta"
                  checked={precios_visibles.includes("venta")}
                  onChange={e => {
                    const { value, checked } = e.target;
                    setPrecios_visibles(prev =>
                      checked ? [...prev, value] : prev.filter(item => item !== value)
                    );
                  }}
                />
                Precio venta
              </label>
            </div>
            <span className="text-[0.85rem] text-gray-500 mt-1 block">
              Si no seleccionas ninguno, no estará disponible ningún precio en el catálogo.
            </span>
          </div>
          {/* Tags */}
          <div>
            <label className="font-semibold">Tags del equipo</label>
            <textarea
              ref={input_tag}
              onChange={captureTags}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Escribe un tag por línea"
            />
            <div className="mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded m-1 inline-block">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[0.85rem] text-gray-500 mt-1 block">
              Escribe un tag por línea.
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={closeModal2} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancelar</button>
          <button
            onClick={crear_products}
            className={`px-4 py-2 rounded transition ${saving ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-800 text-white"}`}
            disabled={saving}
          >
            {saving ? "Creando..." : "Crear equipo"}
          </button>
        </div>
      </div>
    </div>
  );
}
