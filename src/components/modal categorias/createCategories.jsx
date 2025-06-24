import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CreateCategoriesModal({ closeModal, onCreateSuccess }) {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      Swal.fire('El nombre es obligatorio', '', 'warning');
      return;
    }
    setLoading(true);
    // Formatea el nombre: primera letra mayúscula, resto minúscula
    const nombreFormateado = nombre.trim().charAt(0).toUpperCase() + nombre.trim().slice(1).toLowerCase();
    try {
      await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/categorias/create', {
        nombre: nombreFormateado,
      });
      if (onCreateSuccess) onCreateSuccess();
      Swal.fire('¡Categoría creada!', '', 'success');
      closeModal();
    } catch (error) {
      Swal.fire('No se pudo crear la categoría', '', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0000009f] bg-opacity-80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-[90%] max-w-md flex flex-col gap-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg">Crear nueva categoría</h2>
          <button type="button" onClick={closeModal} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>
        <label className="font-semibold">Nombre de la categoría</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Ejemplo: Audio"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={closeModal}
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
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}
