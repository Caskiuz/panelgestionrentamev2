import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uploadFoto } from '../../firebase/images.js'; // Tu función de subida a Firebase
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import dayjs from 'dayjs'; //

export default function CrearNotasRemision({ closeModal2 }) {
  // Estados principales
  const [nombre, setNombre] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [ciudad_estado, setCiudadEstado] = useState('');
  const [fecha_vencimiento, setFechaVencimiento] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [productos, setProductos] = useState([]);
  console.log(productos);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [IVA, setIVA] = useState(false);
  const [loading, setLoading] = useState(false);

  // Equipos para el select
  const [equipos, setEquipos] = useState([]);
  const [busquedaEquipo, setBusquedaEquipo] = useState('');
  const [showSearchMsg, setShowSearchMsg] = useState(false);

  // Agregar este estado arriba en tu componente:
  const [showStockError, setShowStockError] = useState(false);

  // Cargar equipos al montar
  React.useEffect(() => {
    axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/')
      .then(res => setEquipos(res.data.response))
      .catch(() => setEquipos([]));
  }, []);

  // Manejo de imágenes
  const handleFileChange = (e) => {
    setFotos([...fotos, ...Array.from(e.target.files)]);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setFotos([...fotos, ...Array.from(e.dataTransfer.files)]);
  };

  // Opciones para el select de equipos
  const opcionesEquipos = equipos
    .filter(eq =>
      eq.nombre.toLowerCase().includes(busquedaEquipo.toLowerCase())
    )
    .map(eq => ({
      ...eq, // <-- Esto agrega todas las propiedades del producto
      value: eq._id,
      label: eq.nombre,
    }));

  // Cuando el usuario escribe en el input de búsqueda
  const handleBusquedaEquipo = (e) => {
    setBusquedaEquipo(e.target.value);
    setShowSearchMsg(true);
    setProductoSeleccionado(null);
  };

  // Cuando selecciona un producto, se pone el precio automáticamente
  React.useEffect(() => {
    if (productoSeleccionado && productoSeleccionado.precio_renta) {
      setShowSearchMsg(false);
      setCantidad(1);
    }
  }, [productoSeleccionado]);

  // Agregar producto a la lista
  const handleAgregarProducto = () => {
    if (!productoSeleccionado || !cantidad) {
      Swal.fire('Selecciona un equipo y cantidad', '', 'warning');
      return;
    }
    if (productos.length >= 10) {
      Swal.fire('Máximo 10 equipos por nota', '', 'warning');
      return;
    }
    const precio_unitario = Number(productoSeleccionado.precio_renta) || 0;
    setProductos([
      ...productos,
      {
        nombre: productoSeleccionado.label,
        cantidad: Number(cantidad),
        precio_unitario,
        precio_x_cantidad: precio_unitario * Number(cantidad)
      }
    ]);
    setProductoSeleccionado(null);
    setCantidad(1);
    setBusquedaEquipo('');
  };

  // Eliminar producto de la lista
  const handleEliminarProducto = (idx) => {
    setProductos(productos.filter((_, i) => i !== idx));
  };

  // Calcular importe total
  const importe_total = productos.reduce((acc, prod) => acc + prod.precio_x_cantidad, 0);

  // Manejo de submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let urlsFotos = [];
    try {
      if (fotos.length > 0) {
        urlsFotos = await Promise.all(fotos.map(file => uploadFoto(file)));
      }
      // Calcula fecha y hora actual automáticamente
      const now = new Date();
      const fechaActualStr = now.toLocaleDateString('es-MX');
      const horaActualStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

      const payload = {
        nombre:nombre.toUpperCase().trim(),
        domicilio:domicilio.trim(),
        ciudad_estado:ciudad_estado.trim(),
        fecha_actual: fechaActualStr,
        hora_actual: horaActualStr,
        fecha_vencimiento: fecha_vencimiento ? fecha_vencimiento.toLocaleDateString('es-MX') : '',
        fotos: urlsFotos,
        observaciones:observaciones.trim(),
        productos: productos.map(prod => ({
          nombre: prod.nombre,
          cantidad: prod.cantidad,
          precio_unitario: prod.precio_unitario,
          precio_x_cantidad: prod.precio_x_cantidad
        })),
        IVA: IVA,
        importe_total: importe_total.toFixed(2)
      };

      const { data } = await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/create', payload);
      Swal.fire('Nota de remisión creada', '', 'success');
      setLoading(false);
      window.location.reload(); // Recargar la página para ver la nueva nota
      return data.response;
    } catch (error) {
      Swal.fire('Error al crear la nota', '', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00000080] flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 w-[98vw] max-w-6xl max-h-[95vh] flex flex-col gap-4 shadow-lg overflow-y-auto"
          style={{ maxHeight: '95vh' }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg">Generar Nota de Remisión</h2>
            <button type="button" onClick={closeModal2} className="text-gray-500 hover:text-black text-xl">&times;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Nombre*</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="border rounded px-3 py-2 w-full" required />
            </div>
            <div>
              <label className="font-semibold">Domicilio*</label>
              <input type="text" value={domicilio} onChange={e => setDomicilio(e.target.value)} className="border rounded px-3 py-2 w-full" required />
            </div>
            <div>
              <label className="font-semibold">Ciudad/Estado</label>
              <input type="text" value={ciudad_estado} onChange={e => setCiudadEstado(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="font-semibold">Fecha vencimiento*</label>
              <DatePicker
                selected={fecha_vencimiento}
                onChange={date => setFechaVencimiento(date)}
                dateFormat="dd/MM/yyyy"
                className="border rounded px-3 py-2 w-full"
                placeholderText="Selecciona la fecha"
                required
              />
            </div>
          </div>
          {/* Fotos */}
          <div
            className="border-dashed border-2 border-gray-400 rounded p-4 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <label className="font-semibold block mb-2">Fotos (puedes arrastrar o seleccionar varias)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="fotosInput"
            />
            <label htmlFor="fotosInput" className="cursor-pointer text-blue-600 underline">
              Seleccionar imágenes
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {fotos.map((file, idx) => (
                <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">{file.name || file}</span>
              ))}
            </div>
          </div>
          {/* Observaciones */}
          <div>
            <label className="font-semibold">Observaciones</label>
            <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} className="border rounded px-3 py-2 w-full" />
          </div>
          {/* Productos */}
          <div className="border rounded p-3">
            <label className="font-semibold">Equipos (máx. 10)</label>
            <div className="flex flex-col md:flex-row gap-2 mt-2 items-end">
              <div className="flex-1">
                <Select
                  value={productoSeleccionado}
                  onChange={setProductoSeleccionado}
                  options={opcionesEquipos}
                  placeholder="Buscar y seleccionar equipo..."
                  isClearable
                  className="w-full"
                  noOptionsMessage={() => "No hay equipos con ese nombre"}
                />
              </div>
              <div className="flex flex-col items-start relative">
                <label className="text-xs font-semibold mb-1">Cantidad</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={cantidad === 0 ? '' : cantidad}
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val === '') {
                      setCantidad('');
                      setShowStockError(false);
                      return;
                    }
                    val = Number(val);
                    // Asegúrate de que el stock sea un número y no undefined/null
                    const max = productoSeleccionado.stock;
                    if (val > max) {
                      setCantidad(val);
                      setShowStockError(true);
                    } else {
                      setCantidad(val);
                      setShowStockError(false);
                    }
                  }}
                  className="border rounded px-2 py-1 w-20"
                  placeholder="Cantidad"
                  disabled={!productoSeleccionado}
                  autoComplete="off"
                />
                {/* Tooltip tipo nube con icono */}
                {showStockError && (
                  <div className="absolute left-0 -top-12 flex items-center gap-2 bg-white border border-gray-300 shadow-lg rounded px-3 py-2 z-20"
                       style={{ minWidth: 220 }}>
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.591c.75 1.334-.213 2.985-1.742 2.985H3.48c-1.53 0-2.492-1.651-1.743-2.985L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V9a1 1 0 112 0v2a1 1 0 01-1 1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      El máximo de stock es: <b>{productoSeleccionado?.stock}</b>
                    </span>
                    <div className="absolute left-4 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                  </div>
                )}
                
              </div>
              <div className="flex flex-col items-start">
                <label className="text-xs font-semibold mb-1">Precio por unidad</label>
                <input
                  type="text"
                  value={productoSeleccionado && productoSeleccionado.precio_renta ? productoSeleccionado.precio_renta : ''}
                  className="border rounded px-2 py-1 w-28 bg-gray-100"
                  placeholder="Precio renta"
                  disabled
                />
              </div>
              <button
                type="button"
                onClick={handleAgregarProducto}
                className={
                  `px-3 py-1 rounded 
                  ${!productoSeleccionado ||
                    !cantidad ||
                    Number(cantidad) < 1 ||
                    (productoSeleccionado && productoSeleccionado.stock && Number(cantidad) > productoSeleccionado.stock) ||
                    showStockError
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-blue-700'}`
                }
                disabled={
                  !productoSeleccionado ||
                  !cantidad ||
                  Number(cantidad) < 1 ||
                  (productoSeleccionado && productoSeleccionado.stock && Number(cantidad) > productoSeleccionado.stock) ||
                  showStockError
                }
              >
                Agregar
              </button>
            </div>
            {/* Lista de productos agregados */}
            <div className="mt-3">
              {productos.length === 0 && <div className="text-gray-500 text-sm">No hay equipos agregados.</div>}
              {productos.length > 0 && (
                <table className="w-full text-sm mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1">Equipo</th>
                      <th className="p-1">Cantidad</th>
                      <th className="p-1">Precio unitario</th>
                      <th className="p-1">Total</th>
                      <th className="p-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod, idx) => (
                      <tr key={idx}>
                        <td className="p-1">{prod.nombre}</td>
                        <td className="p-1">{prod.cantidad}</td>
                        <td className="p-1">${prod.precio_unitario}</td>
                        <td className="p-1 font-semibold">${prod.precio_x_cantidad}</td>
                        <td className="p-1">
                          <button type="button" className="text-red-500" onClick={() => handleEliminarProducto(idx)}>Quitar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Importe total e IVA */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <label className="font-semibold flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={IVA}
                  onChange={e => setIVA(e.target.checked)}
                />
                ¿Aplica IVA?
              </label>
            </div>
            <div className="font-bold text-lg">
              Importe total: <span className="text-primary">${importe_total.toFixed(2)}</span>
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={closeModal2}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
