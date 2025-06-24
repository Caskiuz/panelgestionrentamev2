import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import Detalle_productos from '../../components/detalle_productos';
import Swal from 'sweetalert2';
export default function lista_productos() {
    const [datas, setDatas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [current_page, setCurrent_page]=useState(parseInt(localStorage.getItem('products_list_current_page')))
    const [itemsPerPage] = useState(8);
    const [filteredDatas, setFilteredDatas] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [modal, setModal]=useState(false)
    const [id, setId]=useState(null)
function openModal(){
  window.scrollTo(0,0)
    setModal(true)
}
function closeModal(){
    setModal(false)
}

    async function get() {
      try {
        const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/products/');
        setDatas(data.response);
        setFilteredDatas(data.response); // Al principio mostramos todos los datos
        setLoading(false); // Datos cargados, actualizamos el estado de carga
      } catch (error) {
        console.error('Error fetching image data:', error);
        setLoading(false); // Si hay un error, dejamos de mostrar el estado de carga
      }
    }
  
    useEffect(() => {
      get();
    }, []);
  
    function handleSearch() {
      // Filtra_ids según el término de búsqueda
      const filtered = datas.filter((dat) =>
        dat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dat.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      // Establece la página actual a la primera si la búsqueda produce resultados diferentes
      setFilteredDatas(filtered);
      setCurrent_page(1); // Restablece la página actual a la 1
    }
    // Limpiar el término de búsqueda
    function clear() {
      setSearchTerm('');
    }
  
    // Ejecutar handleSearch cuando searchTerm se vacíe
    useEffect(() => {
      if (searchTerm === '') {
        handleSearch();
      }
    }, [searchTerm]);
  
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSearch(); // Ejecutar la búsqueda al presionar Enter
      }
    };
       const indexOfLastItem = current_page * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentItems = filteredDatas?.slice(indexOfFirstItem, indexOfLastItem);
          
          const totalPages = Math.ceil(filteredDatas.length / itemsPerPage);
          
          // Cambiar página
          const changePage = (page) => {
            if (page >= 1 && page <= totalPages) {
              setLoading(true); // Activa el loading
              setTimeout(() => {
                setCurrent_page(page);
                setLoading(false); // Desactiva el loading después de un pequeño delay
              }, 300); // 300ms de delay para simular carga
            }
          };
      const generatePaginationButtons = () => {
        let buttons = [];
      
        if (totalPages <= 4) {
          // Mostrar todas las páginas si son pocas
          for (let i = 1; i <= totalPages; i++) {
            buttons.push(i);
          }
        } else {
          const startPage = Math.max(2, current_page - 1); // Páginas antes de la actual
          const endPage = Math.min(totalPages - 1, current_page + 1); // Páginas después de la actual
      
          buttons.push(1); // Primera página
      
          if (startPage > 2) {
            buttons.push("..."); // Puntos suspensivos antes
          }
      
          for (let i = startPage; i <= endPage; i++) {
            buttons.push(i);
          }
      
          if (endPage < totalPages - 1) {
            buttons.push("..."); // Puntos suspensivos después
          }
      
          buttons.push(totalPages); // Última página
        }
      
        return buttons;
      };
      useEffect(() => {
        if (current_page) {
          localStorage.setItem('products_current_page', current_page); // Guardar en localStorage
        }
      }, [current_page]);
  return (
    <>
      {modal === true && (
        <Detalle_productos closeModal={closeModal} id={id}/>
      )}
      <Navbar />
      
      <div className="w-full min-h-screen h-auto flex bg-[#d9d9d97b]">
        <div className=" w-full  rounded-[10px] items-center flex flex-col gap-4 px-[0.5rem] lg:px-[1.5rem] py-[2rem]">
            <p className="text-[1.5rem] lg:text-[2rem] font-semibold underline">Mis equipos</p>
            <div className="flex lg:w-[80%]">
              <div className="relative w-full flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Buscar equipos por nombre o código..."
                  className="w-full py-2 px-[1rem] border border-gray-300 rounded-l-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
                  onKeyDown={handleKeyDown} // Detectar presionar Enter
                />
                {searchTerm && (
                  <button onClick={clear} className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]"
                onClick={handleSearch} // Ejecutar la búsqueda al hacer clic
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </div>
            {loading && (
               <div className="flex flex-col gap-2 text-center items-center">
               <div className="spinner-border text-primary" role="status">
                 <span className="visually-hidden">Loading...</span>
               </div>
               </div>
            )}
            {!loading && filteredDatas.length === 0 ? (
              <div className="text-center text-lg">
                <p>No se encontraron equipos relacionados a tu búsqueda</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary text-white font-semibold px-4 py-2 rounded mt-4"
                >
                  Refrescar
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full lg:w-[80%]">
  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 w-full justify-items-center">
    {loading ? (
      <div className="col-span-2 lg:col-span-4 flex justify-center items-center min-h-[420px]">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      currentItems.map((dat, index) => (
        <div
          key={index}
          className="bg-white w-full max-w-[250px] mx-auto px-2 py-3 rounded-lg flex flex-col gap-2 shadow-md border border-gray-200 hover:shadow-lg transition-all"
          style={{ minHeight: 420 }}
        >
          <div className="flex justify-center items-center w-full h-[150px] bg-[#f3f3f3] rounded">
            <img
              className="object-contain w-[120px] h-[120px]"
              src={dat.foto}
              alt={dat.nombre}
              loading="lazy"
            />
          </div>
          <p className="text-[1rem] text-center font-semibold text-primary mt-2 truncate">{dat.nombre?.toUpperCase()}</p>
          <div className="flex flex-col gap-1 text-center text-[0.95rem]">
            <span className="font-semibold text-gray-600">
              Renta por día:{" "}
              <span className="text-primary">
                ${dat.precios_visibles?.includes("renta") && dat.precio_renta ? dat.precio_renta : 0} MXN
              </span>
            </span>
            <span className="font-semibold text-gray-600">
              Renta por semana:{" "}
              <span className="text-primary">
                ${dat.precios_visibles?.includes("semana") && dat.precio_x_semana ? dat.precio_x_semana : 0} MXN
              </span>
            </span>
            <span className="font-semibold text-gray-600">
              Venta:{" "}
              <span className="text-primary">
                ${dat.precios_visibles?.includes("venta") && dat.precio_venta ? dat.precio_venta : 0} MXN
              </span>
            </span>
          </div>
          {dat.stock === 0 ? (
            <p className="text-center text-danger font-semibold bg-[#ffeaea] rounded-[5px] py-1 text-[0.95rem]">Rentado</p>
          ) : (
            <p className="text-center text-green-600 font-semibold bg-[#eaffea] rounded-[5px] py-1 text-[0.95rem]">
              Queda {dat.stock} disponible
            </p>
          )}
          <button
            onClick={() => {
              openModal();
              setId(dat._id);
            }}
            className="bg-primary text-white py-2 rounded-[5px] text-[0.95rem] font-semibold mt-2 hover:bg-blue-700 transition-all"
          >
            Ficha técnica
          </button>
        </div>
      ))
    )}
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
          className={`px-3 py-1 rounded ${
            current_page === button ? 'bg-blue-500 text-white' : 'bg-gray-300'
          }`}
          onClick={() => changePage(button)}
        >
          {button}
        </button>
      )
    )}
  </div>
</div>
            )}
          </div>
        </div>
      
    </>
  );
}
