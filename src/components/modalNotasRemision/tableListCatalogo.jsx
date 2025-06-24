import '../../styles/inputs.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function tableListCatalogo({ lista, setLista }) {
    const [datos, setDatos] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [cantidad, setCantidad] = useState('1');
    const [dias, setDias] = useState('1');
    const [precio, setPrecio] = useState(''); // Nuevo estado para precio unitario
    const [total, setTotal] = useState();

    async function getData() {
        try {
            const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/')
            setDatos(data.response);
            return data.response;
        } catch (error) {}
    }

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        if (selectedOption) {
            setPrecio(selectedOption.value.precio_renta.toString());
        } else {
            setPrecio('');
        }
    }, [selectedOption]);

    // Calcular total
    function calcularTotal() {
        if (!selectedOption) {
            setTotal(0);
            return;
        }
        // Convierte a número, si está vacío usa 0
        const precioNum = Number(precio) || 0;
        const cantidadNum = Number(cantidad) || 0;
        const diasNum = Number(dias) || 0;
        let descuento = 0;
        if (diasNum < 3) {
            descuento = 0;
        } else if (diasNum >= 3 && diasNum < 6) {
            descuento = 0.05;
        } else if (diasNum >= 6 && diasNum < 9) {
            descuento = 0.10;
        } else if (diasNum >= 9 && diasNum < 12) {
            descuento = 0.15;
        } else if (diasNum >= 12 && diasNum <= 31) {
            descuento = 0.20;
        } else if (diasNum > 31) {
            descuento = 0.30;
        }
        const totalCalc = precioNum * cantidadNum * diasNum * (1 - descuento);
        setTotal(totalCalc);
    }
    useEffect(() => {
        calcularTotal();
    }, [selectedOption, cantidad, dias, precio]);
    // Agregar a la lista
 const handleAgregar = () => {
    if (!selectedOption) return;
    setLista([
      ...lista,
      {
        nombre: selectedOption.value.nombre,
        codigo:selectedOption.value.codigo,
        precio: Number(precio) || 0,
        cantidad: Number(cantidad) || 0,
        dias: Number(dias) || 0,
        descripcion: selectedOption.value.descripcion, // <-- Agrega este campo
        total: Number(total) || 0
      }
    ]);
    setSelectedOption(null);
    setCantidad('1');
    setDias('1');
    setPrecio('');
  };
    return (
            <>
            <div>
                <Select
                    value={selectedOption}
                    onChange={setSelectedOption}
                    options={datos.map((item) => ({
                        value: item,
                        label: `${item.codigo}-${item.nombre}`
                    }))}
                    placeholder="Buscar o seleccionar equipo..."
                    isClearable
                    className="w-full"
                    noOptionsMessage={() => "No hay equipos con ese nombre"}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderRadius: '0.5rem',
                            borderColor: '#d1d5db',
                            minHeight: '44px',
                            boxShadow: 'none',
                        }),
                        menu: (base) => ({
                            ...base,
                            borderRadius: '0.5rem',
                        }),
                    }}
                />
            </div>
            {selectedOption && (
                <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg border">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col flex-1 min-w-[120px]">
                            <label className="text-sm font-semibold mb-1">$/unitario</label>
                            <input
                                type="text"
                                value={precio}
                                onChange={e => setPrecio(e.target.value.replace(/[^0-9.]/g, ''))}
                                className="rounded-lg border px-2 py-1 bg-gray-100 text-gray-700"
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
                        <div className="flex flex-col flex-1 min-w-[120px]">
                            <label className="text-sm font-semibold mb-1">Días</label>
                            <input
                                type="number"
                                min={1}
                                value={dias}
                                onChange={e => setDias(e.target.value)}
                                className="rounded-lg border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{
                                    MozAppearance: 'textfield',
                                    WebkitAppearance: 'none',
                                    margin: 0
                                }}
                            />
                        </div>
                        <div className="flex flex-col flex-1 min-w-[140px]">
                            <label className="text-sm font-semibold mb-1">$ Total x días</label>
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
            )}
            </>
            
    );
}
