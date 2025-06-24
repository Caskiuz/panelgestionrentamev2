import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import axios from 'axios';
import ModalEdit from '../../components/modal_clientes/editar_clientes';
import Modal_detalles from '../../components/modal_clientes/modal_detalles';
import Modal_create from '../../components/modal_clientes/crear_clientes';
import user_foto from '../../images/foto_user_empty.jpg'
import Swal from 'sweetalert2';

export default function panelClientes() {
      const [datas, setDatas] = useState([]);
      const [select, setSelect]=useState()
      const [searchTerm, setSearchTerm] = useState('');
      const [current_page, setCurrent_page]=useState(parseInt(localStorage.getItem('products_current_page')))
      const [itemsPerPage] = useState(4);
      const [filteredDatas, setFilteredDatas] = useState([]);
      const [loading, setLoading] = useState(true);
      const [modaEdit, setModalEdit]=useState(false)
      const [modal_create, setModal_create]=useState(false)
      const [modal_detalles, setModal_detalles]=useState(false)
      function openModal(){
        window.scrollTo(0,0)
        setModalEdit(true)
      }
      function closeModal(){
        setModalEdit(false)
        window.location.reload()
      }
      function openModal2(){
        setModal_create(true)
      }
      function closeModal2(){
        setModal_create(false)
        window.location.reload()
      }
      function openModal_detalles(){
        setModal_detalles(true)
      }
      function closeModal_detalles(){
        setModal_detalles(false)
        window.location.reload()
      }
      async function get() {
        try {
          const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/clients/');
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
          dat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDatas(filtered);
      }
    
      // Limpiar el término de búsqueda
      function clear() {
        setSearchTerm('');
      }
      function handleSearch() {
        // Filtra_ids según el término de búsqueda
        const filtered = datas.filter((dat) =>
          dat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
        // Establece la página actual a la primera si la búsqueda produce resultados diferentes
        setFilteredDatas(filtered);
        setCurrent_page(1); // Restablece la página actual a la 1
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
      async function deleteProduct(_id) {
        console.log(_id);
        try {
          
          const datitos = { _id: _id };
          if (datitos._id) {
            const confirmation = await Swal.fire({
              title: `¿Estás seguro de eliminar este cliente?`,
              showDenyButton: true,
              confirmButtonText: 'Sí',
              denyButtonText: 'No',
              confirmButtonColor: '#3085d6',  // Cambia este color
              denyButtonColor: '#d33', 
            });
    
            if (confirmation.isConfirmed) {
              Swal.fire({
                title: 'Cargando, por favor espere...',
                didOpen: () => {
                  Swal.showLoading();  // Mostrar el spinner de carga
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
          console.log('Error al eliminar el cliente:', error);
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
            
            // Cambiar página
            const changePage = (page) => {
              if (page >= 1 && page <= totalPages) {
                setCurrent_page(page);
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
            localStorage.setItem('clients_current_page', current_page); // Guardar en localStorage
          }
        }, [current_page]);

        // Bloquear scroll del body cuando el modal está abierto
        useEffect(() => {
          if (modaEdit || modal_create || modal_detalles) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = '';
          }
          // Limpieza al desmontar
          return () => {
            document.body.style.overflow = '';
          };
        }, [modaEdit, modal_create, modal_detalles]);
return (
<>
 {modaEdit === true && (
        <ModalEdit _id={select}  closeModal={closeModal} gett={get}/>
    )}
    {modal_create === true && (
        <Modal_create closeModal2={closeModal2}  gett={get}/>
    )}
    {modal_detalles === true && (
        <Modal_detalles _id={select} closeModal_detalles={closeModal_detalles}  gett={get}/>
)}
<Navbar/>
<div className='flex flex-col bg-[#ececec] w-full'>
    <div className='bg-[#ffffff] py-[1rem]  items-center flex justify-between px-[0.5rem] lg:px-[2rem]'>
        <p className='text-[#2D76B5] font-bold text-[0.9rem] lg:text-[1.2rem]'>Panel de Clientes</p>
        <button onClick={openModal2} className='text-white font-semibold bg-[#46af46] text-[0.8rem] lg:text-[1rem] px-[1rem] py-[0.3rem] rounded-[15px]'>+ Crear clientes</button>
    </div>
    <div className='w-full h-auto flex flex-col min-h-[80vh] py-[1rem] gap-2 px-[0.5rem] lg:px-[2rem]'>
        <div className='flex flex-col'>
            <p className='font-semibold text-[1.5rem] text-[#4a4a4a]'>Clientes</p>
            <div id="emailHelp" class="form-text">En este apartado podrás crear, editar o eliminar cualquier cliente creado.</div>
        </div>
    <div className="flex w-full bg-[white] py-[1.5rem] px-[1.5rem] rounded-[10px]">
        <div className="relative w-full items-center">
            <input type="text" placeholder="Buscar clientes..." className="w-full py-2 px-[1rem] border bg-[#f1f1f1] border-gray-300 rounded-l-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/>
            {searchTerm && (
                <button onClick={clear} className="absolute right-2 top-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                </button>
            )}
        </div>
        <button className="px-[2rem] bg-primary text-white font-semibold rounded-r-[10px]" onClick={handleSearch}>
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
        <p>No se encontraron usuarios relacionados a tu búsqueda</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-white font-semibold px-4 py-2 rounded mt-4">Refrescar</button>
    </div>
    ) : (
    <div className="flex flex-col bg-[white] py-[1.5rem] px-[1.5rem] gap-2 w-full overflow-x-hidden overflow-y-auto">
    <div className='flex justify-start border-b-[1px] border-solid '>
        <p className='font-semibold text-[1.1rem] pb-3'>Nombre del cliente</p>
    </div>
    
 {/* ESTO ES PARA MODO WEB */}
 <div className="w-full lg:flex flex-col hidden gap-[1rem] overflow-x-hidden  ">
  {currentItems.map((dat) => (
    <div
      key={dat.id}
      className="flex flex-wrap w-full gap-2 justify-between border-b-[1px] border-gray-300 py-[1rem] px-[1rem] bg-white rounded-lg shadow-md"
    >
      {/* Contenedor de foto y nombre */}
      <div className="flex gap-2 items-center min-w-[200px] max-w-[400px] flex-shrink-0">
        {dat.foto ? (
          <img
            className="w-[3rem] h-[3rem] border-solid border-[1px] border-gray-300 rounded-full"
            src={user_foto}
            alt="Foto"
          />
        ) : (
          <div
            className="w-[3rem] h-[3rem] rounded-full bg-gray-100 border-solid border-[1px] border-gray-300 text-gray-600 flex justify-center items-center"
            data-bs-toggle="tooltip"
            data-bs-title="Ver perfil"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-person-circle w-[1.5rem] h-[1.5rem]"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </div>
        )}
        {/* Ajuste de texto para nombres largos */}
        <p className="text-sm lg:text-base break-words break-all lg:w-full w-[52%]">
          {dat.nombre}
        </p>
      </div>

      {/* Contenedor de botones */}
      <div className="flex gap-3 flex-shrink-0">
        <button
          className="bg-primary text-white rounded-[5px] px-[0.5rem] lg:px-[1rem] py-[0.3rem] flex gap-1 items-center shadow-md"
          onClick={() => {
            openModal();
            setSelect(dat._id);
          }}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white rounded-[5px] px-[0.5rem] lg:px-[1rem] py-[0.3rem] flex gap-1 items-center shadow-md"
          onClick={() => deleteProduct(dat._id)}
        >
          Eliminar
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

 {/* ESTO ES PARA MODO CELULAR */}
 <div className="w-full flex flex-col lg:hidden ">
  <div className="flex flex-wrap ">
    {currentItems.map((dat, index) => (
      <div key={index} className=" w-1/2">
        {/* Aquí va el contenido de cada card */}
        <div className="bg-white px-1 py-3  rounded-lg flex flex-col gap-2">
          <img src={user_foto} alt="" />
          <p className='text-[0.7rem] text-center font-semibold'>{dat.nombre.toUpperCase()}</p>
        <div className='flex flex-col gap-2'>
        <button
          className="bg-primary text-white rounded-[5px] px-[0.5rem] lg:px-[1rem] py-[0.3rem] flex gap-1 items-center  text-[0.8rem] justify-center text-center shadow-md"
          onClick={() => {
            openModal();
            setSelect(dat._id);
          }}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white rounded-[5px] px-[0.5rem] lg:px-[1rem] py-[0.3rem] flex gap-1 items-center shadow-md text-[0.8rem] justify-center text-center"
          onClick={() => deleteProduct(dat._id)}
        >
          Eliminar
        </button>
        </div>
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



    </div>
    )}
    </div>
    
</div>
</>
);}
