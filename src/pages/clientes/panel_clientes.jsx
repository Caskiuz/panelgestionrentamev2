import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ModalEdit from '../../components/modal_clientes/editar_clientes';
import Modal_detalles from '../../components/modal_clientes/modal_detalles';
import Modal_create from '../../components/modal_clientes/crear_clientes';
import user_foto from '../../images/foto_user_empty.jpg';
import Swal from 'sweetalert2';
// ICONOS
import { FaUserCircle, FaUserEdit, FaTrash, FaSearch, FaTimes, FaPlus } from "react-icons/fa";

export default function panelClientes() {
  const [datas, setDatas] = useState([]);
  const [select, setSelect] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [current_page, setCurrent_page] = useState(parseInt(localStorage.getItem('clients_current_page')) || 1);
  const [itemsPerPage] = useState(4);
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modaEdit, setModalEdit] = useState(false);
  const [modal_create, setModal_create] = useState(false);
  const [modal_detalles, setModal_detalles] = useState(false);

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
  function openModal_detalles() {
    setModal_detalles(true);
  }
  function closeModal_detalles() {
    setModal_detalles(false);
    window.location.reload();
  }
  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients/');
      setDatas(data.response);
      setFilteredDatas(data.response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    get();
  }, []);

  function handleSearch() {
    const filtered = datas.filter((dat) =>
      dat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDatas(filtered);
    setCurrent_page(1);
  }

  // Limpiar el término de búsqueda
  function clear() {
    setSearchTerm('');
  }

  useEffect(() => {
    if (searchTerm === '') {
      handleSearch();
    }
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  async function deleteProduct(_id) {
    try {
      const datitos = { _id: _id };
      if (datitos._id) {
        const confirmation = await Swal.fire({
          title: `¿Estás seguro de eliminar este cliente?`,
          showDenyButton: true,
          confirmButtonText: 'Sí',
          denyButtonText: 'No',
          confirmButtonColor: '#3085d6',
          denyButtonColor: '#d33',
        });

        if (confirmation.isConfirmed) {
          Swal.fire({
            title: 'Cargando, por favor espere...',
            didOpen: () => {
              Swal.showLoading();
            }
          });
          await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/clients/delete', {
            data: datitos,
          });
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'El cliente se ha eliminado',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo eliminar este cliente',
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar el cliente. Intenta nuevamente.',
        timer: 1500,
      });
    }
  }

  const indexOfLastItem = current_page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDatas?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDatas.length / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrent_page(page);
    }
  };

  const generatePaginationButtons = () => {
    let buttons = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      const startPage = Math.max(2, current_page - 1);
      const endPage = Math.min(totalPages - 1, current_page + 1);

      buttons.push(1);
      if (startPage > 2) {
        buttons.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }
      if (endPage < totalPages - 1) {
        buttons.push("...");
      }
      buttons.push(totalPages);
    }
    return buttons;
  };

  useEffect(() => {
    if (current_page) {
      localStorage.setItem('clients_current_page', current_page);
    }
  }, [current_page]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (modaEdit || modal_create || modal_detalles) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modaEdit, modal_create, modal_detalles]);

  return (
    <>
      {modaEdit && (
        <ModalEdit _id={select} closeModal={closeModal} gett={get} />
      )}
      {modal_create && (
        <Modal_create closeModal2={closeModal2} gett={get} />
      )}
      {modal_detalles && (
        <Modal_detalles _id={select} closeModal_detalles={closeModal_detalles} gett={get} />
      )}
      <Navbar />
      <div className='flex flex-col bg-[#f6f8fa] w-full min-h-screen'>
        <div className='bg-white py-4 flex flex-col lg:flex-row gap-2 items-center justify-between px-3 lg:px-12 shadow'>
          <p className='text-[#2D76B5] font-bold text-lg lg:text-2xl flex items-center gap-2'>
            <FaUserCircle className="text-[#2D76B5] w-7 h-7" />
            Panel de Clientes
          </p>
          <button
            onClick={openModal2}
            className='flex items-center gap-2 text-white font-semibold bg-[#46af46] text-base px-4 py-2 rounded-2xl shadow hover:bg-green-700 transition'
          >
            <FaPlus className="w-5 h-5" /> Crear cliente
          </button>
        </div>
        <div className='w-full flex flex-col min-h-[80vh] py-4 gap-2 px-2 lg:px-12'>
          <div className='flex flex-col mb-2'>
            <p className='font-semibold text-2xl text-[#4a4a4a]'>Clientes</p>
            <span className="text-gray-500 text-sm">Aquí puedes crear, editar o eliminar cualquier cliente creado.</span>
          </div>
          <div className="flex w-full bg-white py-4 px-4 rounded-lg shadow">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Buscar clientes..."
                className="w-full py-2 px-4 border bg-[#f1f1f1] border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchTerm && (
                <button onClick={clear} className="absolute right-2 top-2 text-gray-400 hover:text-red-600 transition">
                  <FaTimes size={22} />
                </button>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-8 bg-primary text-white font-semibold rounded-r-lg hover:bg-blue-700 transition"
              onClick={handleSearch}
            >
              <FaSearch className="w-5 h-5" /> Buscar
            </button>
          </div>
          {loading && (
            <div className="flex flex-col gap-2 text-center items-center min-h-[200px]">
              <FaUserCircle className="animate-bounce w-10 h-10 text-blue-600 mb-1" />
              <span className="text-blue-700 font-medium">Cargando clientes...</span>
            </div>
          )}
          {!loading && filteredDatas.length === 0 ? (
            <div className="text-center text-lg">
              <p>No se encontraron usuarios relacionados a tu búsqueda</p>
              <button onClick={() => window.location.reload()} className="bg-primary text-white font-semibold px-4 py-2 rounded mt-4 shadow hover:bg-blue-700">
                Refrescar
              </button>
            </div>
          ) : (
            <div className="flex flex-col bg-white py-6 px-2 lg:px-6 gap-2 w-full overflow-x-hidden overflow-y-auto rounded-xl shadow">
              {/* Desktop */}
              <div className="lg:flex flex-col hidden gap-2">
                <div className='flex justify-start border-b pb-2 mb-2'>
                  <p className='font-semibold text-lg'>Nombre del cliente</p>
                </div>
                {currentItems.map((dat) => (
                  <div
                    key={dat._id}
                    className="flex flex-wrap w-full gap-2 justify-between border-b border-gray-200 py-4 px-4 bg-white rounded-lg hover:shadow-lg transition"
                  >
                    {/* Foto y nombre */}
                    <div className="flex gap-2 items-center min-w-[200px] max-w-[400px] flex-shrink-0">
                      {dat.foto ? (
                        <img
                          className="w-12 h-12 border border-gray-300 rounded-full object-cover"
                          src={user_foto}
                          alt="Foto"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-300 text-gray-600 flex justify-center items-center">
                          <FaUserCircle className="w-7 h-7" />
                        </div>
                      )}
                      <p className="text-base break-words break-all w-full">{dat.nombre}</p>
                    </div>
                    {/* Botones */}
                    <div className="flex gap-3 flex-shrink-0">
                      <button
                        className="flex items-center gap-1 bg-blue-600 text-white rounded-lg px-3 py-1 font-semibold shadow hover:bg-blue-700 transition"
                        onClick={() => {
                          openModal();
                          setSelect(dat._id);
                        }}
                        title="Editar cliente"
                      >
                        <FaUserEdit /> Editar
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 text-white rounded-lg px-3 py-1 font-semibold shadow hover:bg-red-700 transition"
                        onClick={() => deleteProduct(dat._id)}
                        title="Eliminar cliente"
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center gap-2 mt-4">
                  {generatePaginationButtons().map((button, index) =>
                    button === "..." ? (
                      <span key={index} className="px-3 py-1 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        className={`px-3 py-1 rounded-lg font-semibold ${
                          current_page === button ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                        onClick={() => changePage(button)}
                      >
                        {button}
                      </button>
                    )
                  )}
                </div>
              </div>
              {/* Mobile */}
              <div className="w-full flex flex-col lg:hidden">
                <div className="grid grid-cols-2 gap-3">
                  {currentItems.map((dat, index) => (
                    <div key={index} className="bg-white px-2 py-4 rounded-xl flex flex-col gap-2 shadow border border-gray-100">
                      <div className="flex justify-center mb-1">
                        {dat.foto ? (
                          <img src={user_foto} className="w-11 h-11 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-300 text-gray-600 flex justify-center items-center">
                            <FaUserCircle className="w-7 h-7" />
                          </div>
                        )}
                      </div>
                      <p className='text-xs text-center font-semibold'>{dat.nombre ? dat.nombre.toUpperCase() : 'Sin nombre'}</p>
                      <div className='flex flex-col gap-2 mt-1'>
                        <button
                          className="flex items-center gap-1 bg-blue-600 text-white rounded-lg px-2 py-1 font-semibold justify-center text-xs shadow hover:bg-blue-700 transition"
                          onClick={() => {
                            openModal();
                            setSelect(dat._id);
                          }}
                          title="Editar cliente"
                        >
                          <FaUserEdit className="w-4 h-4" /> Editar
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-500 text-white rounded-lg px-2 py-1 font-semibold justify-center text-xs shadow hover:bg-red-700 transition"
                          onClick={() => deleteProduct(dat._id)}
                          title="Eliminar cliente"
                        >
                          <FaTrash className="w-4 h-4" /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {generatePaginationButtons().map((button, index) =>
                    button === "..." ? (
                      <span key={index} className="px-3 py-1 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={index}
                        className={`px-3 py-1 rounded-lg font-semibold ${
                          current_page === button ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                        }`}
                        onClick={() => changePage(button)}
                      >
                        {button}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}