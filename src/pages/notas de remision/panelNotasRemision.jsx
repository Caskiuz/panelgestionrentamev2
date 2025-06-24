import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ModalEdit from '../../components/modalEdit';
import Modal_create_users from '../../components/modalNotasRemision/crearNotasRemision';
import Download_pdf from '../../components/download_nota'; // Asegúrate de importar el componente
import Swal from 'sweetalert2';
import { FaFilePdf, FaTrash, FaSearch } from 'react-icons/fa';

export default function PanelNotasRemision() {
  const [datas, setDatas] = useState([]);
  const [user_selected, setUserSelected] = useState();
  const [loading, setLoading] = useState(true);
  const [modaEdit, setModalEdit] = useState(false);
  const [modal_create, setModal_create] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [idNotaDescarga, setIdNotaDescarga] = useState(null);

  function openModal() {
    window.scrollTo(0, 0);
    setModalEdit(true);
  }
  function closeModal() {
    setModalEdit(false);
    window.location.reload();
  }
  function openModal2() {
    setModal_create(true);
  }
  function closeModal2() {
    setModal_create(false);
    window.location.reload();
  }

  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/');
      setDatas(data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    get();
  }, []);

  async function deleteNota(_id) {
    const confirmation = await Swal.fire({
      title: `¿Estás seguro de eliminar esta nota de remisión?`,
      text: 'Si la eliminas, la información de la nota se perderá permanentemente.',
      showDenyButton: true,
      confirmButtonText: 'Sí, eliminar',
      denyButtonText: 'No, cancelar',
      confirmButtonColor: '#d33',
      denyButtonColor: '#B0B0B0',
    });
    try {
      if (confirmation.isConfirmed === true) {
        await axios.delete(
          'https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/delete',
          { data: { _id } }
        );
        await get();
        Swal.fire({
          icon: 'success',
          text: 'La nota de remisión ha sido eliminada con éxito',
          timer: 1500,
        });
        window.location.reload();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar la nota de remisión. Intenta nuevamente.',
        timer: 1500,
      });
    }
  }

  // --- BUSQUEDA ---
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDatas(datas);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredDatas(
  datas.filter(dat =>
    (dat.nombre && dat.nombre.toLowerCase().includes(term)) ||
    (dat.creador && dat.creador.toLowerCase().includes(term)) ||
    (dat.folio_remision && dat.folio_remision.toString().toLowerCase().includes(term))
  )
);
    }
  }, [searchTerm, datas]);

  return (
    <>
      {modaEdit && (
        <ModalEdit closeModal={closeModal} usuario={user_selected} gett={get} />
      )}
      {modal_create && (
        <Modal_create_users closeModal2={closeModal2} gett={get} />
      )}
      {showDownloadModal && idNotaDescarga && (
        <div className="fixed inset-0 z-50 bg-[#00000090] flex items-center justify-center">
          <Download_pdf
            id={idNotaDescarga}
            close_modal2={() => {
              setShowDownloadModal(false);
              setIdNotaDescarga(null);
            }}
          />
        </div>
      )}
      <Navbar />
      <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto w-full py-6 px-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-blue-800">Mis Notas de Remisión</h1>
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
          </div>
          <div className="form-text mb-4 text-gray-600">En este apartado podrás buscar, eliminar o descargar tus PDF de notas de remisión.</div>
          {loading ? (
            <div className="flex flex-col gap-2 text-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
              <span className="text-blue-700 font-semibold mt-2">Cargando...</span>
            </div>
          ) : filteredDatas.length === 0 ? (
            <div className="text-center text-lg py-10">
              <p>No se encontraron notas de remisión</p>
              <button onClick={() => window.location.reload()} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-4">Refrescar</button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {/* TABLA DESKTOP MEJORADA */}
              <table className="min-w-full lg:table hidden bg-white rounded-lg overflow-hidden shadow border">
                <thead>
                  <tr className="bg-blue-700 text-white text-center">
                    <th className="py-3 px-4 whitespace-nowrap">Folio</th>
                    <th className="py-3 px-4 whitespace-nowrap">Cliente</th>
                    <th className="py-3 px-4 whitespace-nowrap">Encargado</th>
                    <th className="py-3 px-4 whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDatas.map((dat, idx) => (
                    <tr
                      key={dat._id}
                      className={`text-center even:bg-blue-50 hover:bg-blue-100 transition`}
                    >
                      <td className="py-2 px-4 border-b border-blue-100">{dat.folio_remision || '-'}</td>
                      <td className="py-2 px-4 border-b border-blue-100">{dat.nombre || '-'}</td>
                      <td className="py-2 px-4 border-b border-blue-100">{dat.creador || '-'}</td>
                      <td className="py-2 px-4 border-b border-blue-100 flex flex-wrap gap-1 justify-center">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 shadow transition"
                          title="Eliminar"
                          onClick={() => deleteNota(dat._id)}
                        >
                          <FaTrash size={16} />
                        </button>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 shadow transition"
                          title="Descargar PDF"
                          onClick={() => {
                            setShowDownloadModal(true);
                            setIdNotaDescarga(dat._id);
                          }}
                        >
                          <FaFilePdf size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* MOBILE CARDS */}
              <div className="flex flex-col gap-4 lg:hidden mt-4">
                {filteredDatas.map((dat, idx) => (
                  <div
                    key={dat._id || idx}
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-base text-[#2D76B5] mb-1">Folio: {dat.folio_remision || '-'}</div>
                        <div className="text-gray-700">Cliente: {dat.nombre || '-'}</div>
                        <div className="text-gray-700">Encargado: {dat.creador || '-'}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end mt-2">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 shadow transition"
                        title="Eliminar"
                        onClick={() => deleteNota(dat._id)}
                      >
                        <FaTrash size={16} />
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 shadow transition"
                        title="Descargar PDF"
                        onClick={() => {
                          setShowDownloadModal(true);
                          setIdNotaDescarga(dat._id);
                        }}
                      >
                        <FaFilePdf size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
