import React, { useState } from 'react';

export default function tableListPersonalizado({ lista, setLista }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [total, setTotal] = useState(0);

  // Calcular total (sin días)
  React.useEffect(() => {
    const precioNum = Number(precio) || 0;
    const cantidadNum = Number(cantidad) || 0;
    setTotal(precioNum * cantidadNum);
  }, [precio, cantidad]);

  const handleAgregar = () => {
    if (!nombre || !precio) return;
    setLista([
      ...lista,
      {
        nombre,
        precio: Number(precio) || 0,
        cantidad: Number(cantidad) || 0,
        total: Number(total) || 0
      }
    ]);
    setNombre('');
    setPrecio('');
    setCantidad('1');
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg border shadow-sm w-full">
      <div className="flex flex-col flex-1 min-w-[120px]">
        <label className="text-sm font-semibold mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value.toUpperCase())}
          className="rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nombre del artículo"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-sm font-semibold mb-1">$/unitario</label>
          <input
            type="text"
            value={precio}
            onChange={e => setPrecio(e.target.value.replace(/[^0-9.]/g, ''))}
            className="rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Precio"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-sm font-semibold mb-1">Cant.</label>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            className="rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              MozAppearance: 'textfield',
              WebkitAppearance: 'none',
              margin: 0
            }}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[140px]">
          <label className="text-sm font-semibold mb-1">$ Total</label>
          <input
            type="text"
            value={total}
            readOnly
            className="rounded-lg border px-2 py-1 bg-gray-100 text-gray-700 font-semibold"
          />
        </div>
      </div>
      <div className="text-end mt-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          onClick={handleAgregar}
          disabled={lista.length >= 12}
        >
          Agregar
        </button>
        {lista.length >= 12 && (
          <span className="text-red-500 text-sm mt-2 block">Máximo 12 artículos por nota.</span>
        )}
      </div>
    </div>
  );
}
