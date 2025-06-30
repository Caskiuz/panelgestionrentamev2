import React, { useState } from 'react';

// Estructura de un servicio general
// {
//   nombre: string,
//   categoria: string,
//   descripcion: string,
//   fechaVencimiento: string (YYYY-MM-DD),
//   monto: number,
//   pagado: boolean,
//   recordatorio: boolean,
//   emailRecordatorio: string,
//   frecuencia: 'mensual' | 'anual' | 'única',
//   notas: string
// }

const CATEGORIAS = [
  'Luz', 'Agua', 'Internet', 'Cable', 'Aseo', 'Suscripción', 'Otro'
];

export default function ServiciosGeneralesManager({ onServiciosChange }) {
  const [servicios, setServicios] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    fechaVencimiento: '',
    monto: '',
    pagado: false,
    recordatorio: false,
    emailRecordatorio: '',
    frecuencia: 'mensual',
    notas: ''
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setNuevo({ ...nuevo, [name]: type === 'checkbox' ? checked : value });
  }

  function agregarServicio(e) {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.fechaVencimiento || !nuevo.monto) return;
    setServicios([...servicios, { ...nuevo, monto: parseFloat(nuevo.monto) }]);
    setNuevo({
      nombre: '', categoria: '', descripcion: '', fechaVencimiento: '', monto: '', pagado: false, recordatorio: false, emailRecordatorio: '', frecuencia: 'mensual', notas: ''
    });
    if (onServiciosChange) onServiciosChange([...servicios, { ...nuevo, monto: parseFloat(nuevo.monto) }]);
  }

  function marcarPagado(idx) {
    const actualizados = servicios.map((s, i) => i === idx ? { ...s, pagado: !s.pagado } : s);
    setServicios(actualizados);
    if (onServiciosChange) onServiciosChange(actualizados);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h2 className="text-xl font-bold mb-4 text-blue-900">Gestión de Servicios Generales</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" onSubmit={agregarServicio}>
        <input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre del servicio" className="border rounded px-2 py-1" required />
        <select name="categoria" value={nuevo.categoria} onChange={handleChange} className="border rounded px-2 py-1">
          <option value="">Categoría</option>
          {CATEGORIAS.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <input name="descripcion" value={nuevo.descripcion} onChange={handleChange} placeholder="Descripción" className="border rounded px-2 py-1 md:col-span-2" />
        <input name="fechaVencimiento" type="date" value={nuevo.fechaVencimiento} onChange={handleChange} className="border rounded px-2 py-1" required />
        <input name="monto" type="number" value={nuevo.monto} onChange={handleChange} placeholder="$ Monto" className="border rounded px-2 py-1" required />
        <select name="frecuencia" value={nuevo.frecuencia} onChange={handleChange} className="border rounded px-2 py-1">
          <option value="mensual">Mensual</option>
          <option value="anual">Anual</option>
          <option value="única">Única vez</option>
        </select>
        <input name="emailRecordatorio" type="email" value={nuevo.emailRecordatorio} onChange={handleChange} placeholder="Email para recordatorio" className="border rounded px-2 py-1" />
        <label className="flex items-center gap-2">
          <input name="recordatorio" type="checkbox" checked={nuevo.recordatorio} onChange={handleChange} />
          Activar recordatorio
        </label>
        <input name="notas" value={nuevo.notas} onChange={handleChange} placeholder="Notas adicionales" className="border rounded px-2 py-1 md:col-span-2" />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 col-span-2">Agregar Servicio</button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Servicios registrados</h3>
      <table className="min-w-full text-xs md:text-sm border">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-2 py-1">Nombre</th>
            <th className="px-2 py-1">Categoría</th>
            <th className="px-2 py-1">Vence</th>
            <th className="px-2 py-1">Monto</th>
            <th className="px-2 py-1">Pagado</th>
            <th className="px-2 py-1">Recordatorio</th>
            <th className="px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-2">Sin servicios registrados</td></tr>
          ) : (
            servicios.map((s, i) => (
              <tr key={i} className="border-b">
                <td className="px-2 py-1">{s.nombre}</td>
                <td className="px-2 py-1">{s.categoria}</td>
                <td className="px-2 py-1">{s.fechaVencimiento}</td>
                <td className="px-2 py-1">${s.monto.toFixed(2)}</td>
                <td className="px-2 py-1">
                  <button onClick={() => marcarPagado(i)} className={`px-2 py-1 rounded ${s.pagado ? 'bg-green-200' : 'bg-red-200'}`}>{s.pagado ? 'Sí' : 'No'}</button>
                </td>
                <td className="px-2 py-1">{s.recordatorio ? 'Sí' : 'No'}</td>
                <td className="px-2 py-1">{s.notas}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
