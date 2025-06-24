import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import axios from 'axios';
import trash from '../../images/trash.png';
import Swal from 'sweetalert2';

export default function DeleteUsers() {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/admins/');
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
      dat.usuario.toLowerCase().includes(searchTerm.toLowerCase())
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
  async function deleteUser(user) {
    try {
      const datitos = {
        usuario: user, // El usuario que quieres eliminar
      };

      if (datitos.usuario) {
        const confirmation = await Swal.fire({
          title: `¿Estás seguro de eliminar este usuario ${user} ?`,
          showDenyButton: true,
          confirmButtonText: 'Sí',
          denyButtonText: 'No',
          confirmButtonColor: '#3085d6',  // Cambia este color
          denyButtonColor: '#d33', 
        });

        if (confirmation.isConfirmed) {
          // Aquí es donde se debe enviar correctamente el cuerpo de la solicitud
          await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/admins/delete', {
            data: datitos, // Pasamos los datos de usuario dentro del campo 'data'
          });

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'El usuario se ha eliminado',
            showConfirmButton: false,
            timer: 1500,
          });

          window.location.reload(); // Recargar la página para reflejar los cambios
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo eliminar este usuario',
          timer: 1500,
        });
      }
    } catch (error) {
      console.log('Error al eliminar usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar el usuario. Intenta nuevamente.',
        timer: 1500,
      });
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Ejecutar la búsqueda al presionar Enter
    }
  };
  return (
    <>
      <Navbar />
      
      <div className="w-full h-full flex">
        
        <div className="w-full flex justify-center items-center bg-[#EBEBEB] relative h-[89vh]">
          <div className="bg-[white] w-[90%] rounded-[10px] items-center flex flex-col gap-4 px-[1.5rem] py-[2rem]">
            <p className="text-[1.5rem] font-semibold font-serif">Eliminar usuarios</p>
            <div className="flex w-full">
            <div className="relative w-full items-center">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
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
                <p>No se encontraron usuarios relacionados a tu búsqueda</p>
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
                      {!dat.foto && (
                        <div className="w-[3rem] h-auto rounded-full bg-gray-100 text-white" data-bs-toggle="tooltip" data-bs-title="Ver perfil">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                          </svg>
                        </div>
                      )}
                      <p>{dat.usuario}</p>
                    </div>
                    <button onClick={() => deleteUser(dat.usuario)}>
                      <img className="w-[1.5rem]" src={trash} alt="" />
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
