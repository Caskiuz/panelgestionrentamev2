import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function DeleteCategoriesModal({ closeModal, onDeleteSuccess }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/categorias/');
        setCategorias(data.response || []);
      } catch (error) {
        Swal.fire('Error al cargar las categorías', '', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Seguro que deseas eliminar esta categoría?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    setEliminando(true);
    try {
      // Aquí enviamos el id por el body usando data
      await axios.delete(
        'https://backrecordatoriorenta-production.up.railway.app/api/categorias/delete',
        { data: { _id: id } }
      );
      setCategorias((prev) => prev.filter((cat) => cat._id !== id));
      if (onDeleteSuccess) onDeleteSuccess();
      Swal.fire('¡Eliminada!', 'La categoría ha sido eliminada.', 'success');
    } catch (error) {
      Swal.fire('No se pudo eliminar la categoría', '', 'error');
    } finally {
      setEliminando(false);
    }
  };

  // Formatea el nombre: primera letra mayúscula, resto minúscula
  const formatNombre = (nombre) => {
    if (!nombre) return '';
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
  };

  const handleEdit = (cat) => {
    setEditandoId(cat._id);
    setNuevoNombre(cat.nombre);
  };

  const handleSaveEdit = async (cat) => {
    const nombreFormateado = formatNombre(nuevoNombre.trim());
    if (!nombreFormateado) {
      Swal.fire('El nombre no puede estar vacío', '', 'warning');
      return;
    }
    try {
      await axios.put(
        `https://backrecordatoriorenta-production.up.railway.app/api/categorias/update/${cat._id}`,
        {nombre: nombreFormateado }
      );
      setCategorias((prev) =>
        prev.map((c) =>
          c._id === cat._id ? { ...c, nombre: nombreFormateado } : c
        )
      );
      setEditandoId(null);
      Swal.fire('¡Actualizada!', 'La categoría ha sido editada.', 'success');
    } catch (error) {
      Swal.fire('No se pudo editar la categoría', '', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0000009f] bg-opacity-80 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Eliminar o editar categorías</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>
        {loading ? (
          <div className="text-center py-8">Cargando categorías...</div>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {categorias.length === 0 && (
              <li className="text-gray-500 text-center">No hay categorías registradas.</li>
            )}
            {categorias.map((cat) => (
              <li key={cat._id} className="flex justify-between items-center border-b py-2 gap-2">
                {editandoId === cat._id ? (
                  <>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={e => setNuevoNombre(e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                      autoFocus
                    />
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                      onClick={() => handleSaveEdit(cat)}
                      disabled={eliminando}
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                      onClick={() => setEditandoId(null)}
                      disabled={eliminando}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{cat.nombre}</span>
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => handleEdit(cat)}
                        disabled={eliminando}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDelete(cat._id)}
                        disabled={eliminando}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
