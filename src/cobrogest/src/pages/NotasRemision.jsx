import React, { useEffect, useState } from 'react';
import CobroGestSidebar from '../components/CobroGestSidebar';
import axios from 'axios';
import { FaFilePdf, FaTrash, FaSearch } from 'react-icons/fa';

const API_BASE = 'https://backrecordatoriorenta-production.up.railway.app/api/notas_remision';

export default function NotasRemisionPage() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotas, setFilteredNotas] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [idNotaDescarga, setIdNotaDescarga] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtener token si es necesario
  const token = localStorage.getItem('token');
  const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  async function fetchNotas() {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await axios.get(`${API_BASE}/`, axiosConfig);
      setNotas(data.response || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMsg(error?.response?.data?.message || 'Error al cargar notas de remisión');
    }
  }

  useEffect(() => {
    fetchNotas();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotas(notas);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredNotas(
        notas.filter(nota =>
          (nota.nombre && nota.nombre.toLowerCase().includes(term)) ||
          (nota.creador && nota.creador.toLowerCase().includes(term)) ||
          (nota.folio_remision && nota.folio_remision.toString().toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, notas]);

  async function deleteNota(_id) {
    if (!window.confirm('¿Estás seguro de eliminar esta nota de remisión?')) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await axios.delete(`${API_BASE}/delete`, { ...axiosConfig, data: { _id } });
      await fetchNotas();
      setLoading(false);
      // alert('Nota de remisión eliminada con éxito');
    } catch (error) {
      setLoading(false);
      setErrorMsg(error?.response?.data?.message || 'Error al eliminar la nota de remisión');
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#C70000] to-[#0D6EFD] font-sans">
      <CobroGestSidebar />
      <main className="flex-1 p-2 md:p-8 overflow-y-auto bg-gray-100 min-h-screen md:ml-0 md:pl-64 transition-all duration-300">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Notas de Remisión</h1>
          <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2 shadow">
            <FaSearch className="text-blue-400" />
            <input
              type="text"
              placeholder="Buscar por folio, cliente o creador..."
              className="outline-none bg-transparent text-blue-700 w-56"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        <section className="bg-white p-6 rounded-xl shadow-inner mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Listado de Notas de Remisión</h3>
          {errorMsg && <div className="mb-4 text-red-600 font-semibold text-sm">{errorMsg}</div>}
          {loading ? (
            <div className="flex flex-col gap-2 text-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
              <span className="text-blue-700 font-semibold mt-2">Cargando...</span>
            </div>
          ) : filteredNotas.length === 0 ? (
            <div className="text-center text-lg py-10">
              <p>No se encontraron notas de remisión</p>
              <button onClick={fetchNotas} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-4">Refrescar</button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full bg-white rounded-lg shadow">
              <table className="min-w-[600px] w-full bg-white rounded-lg overflow-hidden shadow border text-xs md:text-sm">
                <thead>
                  <tr className="bg-blue-700 text-white text-center">
                    <th className="py-3 px-2 md:px-4 whitespace-nowrap">Folio</th>
                    <th className="py-3 px-2 md:px-4 whitespace-nowrap">Cliente</th>
                    <th className="py-3 px-2 md:px-4 whitespace-nowrap">Encargado</th>
                    <th className="py-3 px-2 md:px-4 whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotas.map((nota) => (
                    <tr key={nota._id} className="text-center even:bg-blue-50 hover:bg-blue-100 transition">
                      <td className="py-2 px-2 md:px-4 border-b border-blue-100 max-w-[100px] truncate" title={nota.folio_remision}>{nota.folio_remision || '-'}</td>
                      <td className="py-2 px-2 md:px-4 border-b border-blue-100 max-w-[120px] truncate" title={nota.nombre}>{nota.nombre || '-'}</td>
                      <td className="py-2 px-2 md:px-4 border-b border-blue-100 max-w-[120px] truncate" title={nota.creador}>{nota.creador || '-'}</td>
                      <td className="py-2 px-2 md:px-4 border-b border-blue-100 flex flex-wrap gap-1 justify-center">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 shadow transition"
                          title="Eliminar"
                          onClick={() => deleteNota(nota._id)}
                        >
                          <FaTrash size={16} />
                        </button>
                        <a
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 shadow transition"
                          title="Descargar PDF"
                          href={`https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/pdf/${nota._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFilePdf size={16} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
