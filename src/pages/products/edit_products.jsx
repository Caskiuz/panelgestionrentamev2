import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import axios from 'axios';
import pen from '../../images/pen.png';
import ModalEdit_product from '../../components/modalEdit_products';

export default function edit_products() {
  const [datas, setDatas] = useState([]);
  const [product_selected, setProductSelected]=useState()
  const [nombre, setNombre]=useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modaEdit, setModalEdit]=useState(false)

  function openModal(){
    setModalEdit(true)
  }
  function closeModal(){
    setModalEdit(false)
    window.location.reload()
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
    // Filtrar los usuarios cuando se haga clic en el botón de búsqueda
    const filtered = datas.filter((dat) =>
      dat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dat.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDatas(filtered);
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
  return (
    <>
      {modaEdit === true && (
        <ModalEdit_product closeModal={closeModal} _id={product_selected} nombre={nombre}/>
      )}
      <Navbar />
      
      <div className="w-full h-full flex">
        
        <div className="w-full flex justify-center items-center bg-[#EBEBEB] relative h-[89vh]">
          <div className="bg-[white] w-[90%] rounded-[10px] items-center flex flex-col gap-4 px-[1.5rem] py-[2rem]">
            <p className="text-[1.5rem] font-semibold font-serif">Editar equipos</p>
            <div className="flex w-full">
            <div className="relative w-full items-center">
                <input
                  type="text"
                  placeholder="Buscar equipos por nombre o codigo..."
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
              <div className="flex flex-col gap-4 w-full overflow-y-auto max-h-[40vh]">
                {filteredDatas.map((dat) => (
                  <div className="w-full bg-[#EBEBEB] rounded-[10px] flex justify-between items-center px-[1rem] h-auto py-[0.5rem]" key={dat._id}>
                    <div className="flex gap-4 items-center">
                      {dat.foto && <img className="w-[3rem] h-[3rem] rounded-full" src={dat.foto} alt="" />}
                      <p className="break-words w-[150px]">{dat.nombre}</p>
                      {dat.stock > 0 && (
                        <p className='lg:flex hidden'>Cantidad: {dat.stock}</p>
                      )}
                      {dat.stock === 0 && (
                        <p className='lg:flex hidden'>Agotado</p>
                      )}
                      <p className='lg:flex hidden'>${dat.precio} MXN</p>
                    </div>
                    <button onClick={()=>{openModal(),setProductSelected(dat._id), setNombre(dat.nombre)}}>
                      <img className="w-[1.5rem]" src={pen} alt="" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
