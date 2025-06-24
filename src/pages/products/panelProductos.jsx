import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ModalEdit from '../../components/modal products/modal_edit_product';
import Modal_create_users from '../../components/modal products/modal_create_products';
import AgregarMetatags from '../../components/modal products/agregar_metatags';
import Swal from 'sweetalert2';
import Modal_ficha from '../../components/detalle_productos';
import CreateCategoriesModal from '../../components/modal categorias/createCategories';
import DeleteCategoriesModal from '../../components/modal categorias/deleteCategories';

function ProductCard({ dat, onEdit, onTags, onDelete }) {
  return (
    <div className="bg-white w-full max-w-xs text-center px-2 py-2 rounded-lg items-center flex flex-col gap-1 shadow hover:shadow-lg transition">
      <img
        className="w-full h-[180px] object-contain rounded mb-1"
        src={dat.foto}
        alt={dat.nombre}
        style={{ background: "#FFFF" }}
      />
      <p
        title={dat.nombre}
        className="truncate max-w-[100%] text-[0.95rem] text-primary font-semibold"
      >
        {dat.nombre.toUpperCase()}
      </p>
      <div className="flex flex-col">
        <p className="text-gray-500 text-[0.7rem] font-semibold">Renta x día</p>
        <p className="text-secondary font-semibold text-[0.95rem]">${dat.precio_renta} MXN</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-500 text-[0.7rem] font-semibold">Renta x semana</p>
        <p className="text-secondary font-semibold text-[0.95rem]">${dat.precio_x_semana || 0} MXN</p>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-500 text-[0.7rem] font-semibold">Venta</p>
        <p className="text-secondary font-semibold text-[0.95rem]">${dat.precio_venta} MXN</p>
      </div>
      <div className="flex flex-col gap-1 w-full mt-1">
        <button
          className="bg-warning w-full text-white py-1 rounded font-semibold hover:bg-yellow-600 transition text-[0.95rem]"
          onClick={() => onEdit(dat._id)}
        >
          Editar
        </button>
        <button
          className="bg-primary w-full text-white py-1 rounded font-semibold hover:bg-blue-700 transition text-[0.95rem]"
          onClick={() => onTags(dat._id)}
        >
          Tags
        </button>
        <button
          className="bg-danger w-full text-white py-1 rounded font-semibold hover:bg-red-700 transition text-[0.95rem]"
          onClick={() => onDelete(dat._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default function PanelProductos() {
  const [productos, setProductos] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalTags, setModalTags] = useState(false);
  const [modalFicha, setModalFicha] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = parseInt(localStorage.getItem('products_current_page'), 10);
    return !saved || isNaN(saved) || saved < 1 ? 1 : saved;
  });
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all products for search
  const getAllProducts = useCallback(async () => {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/');
      setAllProducts(data.response);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  }, []);

  // Fetch paginated products
  const getPaginatedProducts = useCallback(async (page = currentPage) => {
    setLoading(true);
    setLoadingImages(true);
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/products/read_pag?page=${page}`);
      setProductos(data.response);
      setTotalPages(data?.totalPages || 1);
      setLoading(false);
      setLoadingImages(false);
    } catch (error) {
      setLoading(false);
      setLoadingImages(false);
      if (error.response?.data?.message?.includes('Página fuera de rango')) {
        setCurrentPage(1);
        localStorage.setItem('products_current_page', 1);
        getPaginatedProducts(1);
      }
    }
  }, [currentPage]);

  useEffect(() => {
    getAllProducts();
    getPaginatedProducts();
  }, [getAllProducts, getPaginatedProducts]);

  // Buscar productos
  const buscar = useCallback(() => {
    if (!searchTerm) {
      setShowFiltered(false);
      setFiltered([]);
      return;
    }
    const filteredList = allProducts.filter((dat) =>
      dat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredList);
    setShowFiltered(true);
  }, [searchTerm, allProducts]);

  // Handlers para modales
  const openEdit = (id) => {
    setSelectedId(id);
    setModalEdit(true);
    document.body.style.overflow = 'hidden';
  };
  const closeEdit = () => {
    setModalEdit(false);
    setSelectedId(null);
    getPaginatedProducts(currentPage);
    document.body.style.overflow = 'auto';
  };
  const openCreate = () => {
    setModalCreate(true);
    document.body.style.overflow = 'hidden';
  };
  const closeCreate = () => {
    setModalCreate(false);
    getPaginatedProducts(currentPage);
    document.body.style.overflow = 'auto';
  };
  const openTags = (id) => {
    setSelectedId(id);
    setModalTags(true);
    document.body.style.overflow = 'hidden';
  };
  const closeTags = () => {
    setModalTags(false);
    setSelectedId(null);
    document.body.style.overflow = 'auto';
  };
  const closeFicha = () => {
    setModalFicha(false);
    setSelectedId(null);
    document.body.style.overflow = 'auto';
  };

  // Categorías
  const openCreateCategoryModal = () => {
    setShowCreateCategoryModal(true);
    document.body.style.overflow = 'hidden';
  };
  const closeCreateCategoryModal = () => {
    setShowCreateCategoryModal(false);
    document.body.style.overflow = 'auto';
  };
  const openDeleteCategoryModal = () => {
    setShowDeleteCategoryModal(true);
    document.body.style.overflow = 'hidden';
  };
  const closeDeleteCategoryModal = () => {
    setShowDeleteCategoryModal(false);
    document.body.style.overflow = 'auto';
  };

  // Eliminar producto
  async function deleteProduct(_id) {
    try {
      const confirmation = await Swal.fire({
        title: `¿Estás seguro de eliminar este equipo?`,
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: 'No',
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
      });

      if (confirmation.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          didOpen: () => Swal.showLoading()
        });
        await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/products/delete', {
          data: { _id }
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'El equipo se ha eliminado',
          showConfirmButton: false,
          timer: 1200,
        });
        getPaginatedProducts(currentPage);
        getAllProducts();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar el equipo. Intenta nuevamente.',
        timer: 1500,
      });
    }
  }

  // Paginación
  function generatePageNumbers(currentPage, totalPages, maxPagesToShow = 7) {
    const pages = [];
    const halfRange = Math.floor(maxPagesToShow / 2);
    let start = Math.max(currentPage - halfRange, 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      localStorage.setItem('products_current_page', page);
      getPaginatedProducts(page);
    }
  }
  function nextPage() {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }
  function prevPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  // Buscador
  function clearSearch() {
    setSearchTerm('');
    setShowFiltered(false);
    setFiltered([]);
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') buscar();
  }

  return (
    <>
      {modalEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="w-[95vw] max-w-3xl max-h-[95vh] overflow-y-auto rounded-lg shadow-lg bg-white relative">
            <ModalEdit closeModal={closeEdit} _id={selectedId} gett={getPaginatedProducts} />
          </div>
        </div>
      )}
      {modalCreate && (
        <Modal_create_users closeModal2={closeCreate} gett={getPaginatedProducts} />
      )}
      {modalTags && (
        <AgregarMetatags closeModal3={closeTags} _id={selectedId} />
      )}
      {modalFicha && (
        <Modal_ficha closeModal={closeFicha} id={selectedId} />
      )}
      <Navbar />
      <div className='flex flex-col bg-[#f6f8fa] min-h-screen w-full'>
        <div className='bg-white py-4 flex flex-col lg:flex-row gap-2 justify-between px-4 lg:px-12 shadow'>
          <p className='text-[#2D76B5] font-bold text-lg lg:text-2xl'>Panel de Equipos</p>
          <div className="flex gap-2">
            <button
              onClick={openCreate}
              className='text-white font-semibold bg-[#46af46] text-sm lg:text-base px-4 py-2 rounded-2xl shadow hover:bg-green-700 transition'
            >
              + Crear equipos
            </button>
            <button
              onClick={openCreateCategoryModal}
              className='text-white font-semibold bg-[#2D76B5] text-sm lg:text-base px-4 py-2 rounded-2xl shadow hover:bg-blue-800 transition'
            >
              + Crear categoría
            </button>
            <button
              onClick={openDeleteCategoryModal}
              className='text-white font-semibold bg-warning text-sm lg:text-base px-4 py-2 rounded-2xl shadow hover:bg-red-700 transition'
            >
              Eliminar / Editar categoría
            </button>
          </div>
        </div>
        <div className='w-full flex flex-col py-6 gap-2 px-5 lg:px-12 min-h-[81vh]'>
          <div className='flex flex-col mb-2'>
            <p className='font-semibold text-2xl text-[#4a4a4a]'>Equipos</p>
            <span className="text-gray-500 text-sm">Aquí puedes crear, editar o eliminar cualquier equipo creado.</span>
          </div>
          <div className="flex w-full bg-white py-4 px-4 rounded-lg shadow">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Buscar equipos..."
                className="w-full py-2 px-4 border bg-[#f1f1f1] border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-2 top-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                  </svg>
                </button>
              )}
            </div>
            <button
              className="px-8 bg-primary text-white font-semibold rounded-r-lg hover:bg-blue-700 transition"
              onClick={buscar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </div>
          {/* Loader */}
          {loading && (
            <div className="w-full text-center h-[40vh] flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className='text-primary font-semibold'>Cargando equipos...</p>
            </div>
          )}
          {/* Sin productos */}
          {!loading && !showFiltered && productos.length === 0 && (
            <div className="w-full text-center h-[40vh] flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <p className="text-gray-500">No hay equipos disponibles para la renta.</p>
            </div>
          )}
          {/* Sin resultados de búsqueda */}
          {!loading && showFiltered && searchTerm && filtered.length === 0 && (
            <div className="w-full text-center h-[40vh] flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <p className="text-gray-500">No se encontraron resultados para tu búsqueda.</p>
            </div>
          )}
          {/* Lista de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center mt-4">
            {showFiltered
              ? filtered.map((dat, idx) => (
                  <ProductCard
                    key={dat._id}
                    dat={dat}
                    onEdit={openEdit}
                    onTags={openTags}
                    onDelete={deleteProduct}
                  />
                ))
              : productos.map((dat, idx) => (
                  <ProductCard
                    key={dat._id}
                    dat={dat}
                    onEdit={openEdit}
                    onTags={openTags}
                    onDelete={deleteProduct}
                  />
                ))}
          </div>
          {/* Paginación */}
          {!showFiltered && productos.length > 0 && (
            <div className="w-full py-8 flex items-center justify-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-[#0D6EFD] disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Anterior
              </button>
              <div className="flex gap-2">
                {generatePageNumbers(currentPage, totalPages).map((page) => (
                  <button
                    key={page}
                    disabled={currentPage === page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg font-semibold ${
                      currentPage === page
                        ? "bg-[#0D6EFD] text-white"
                        : "bg-white text-black border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="bg-[#0D6EFD] disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
      {showCreateCategoryModal && (
        <CreateCategoriesModal closeModal={closeCreateCategoryModal} />
      )}
      {showDeleteCategoryModal && (
        <DeleteCategoriesModal closeModal={closeDeleteCategoryModal} />
      )}
    </>
  );
}
