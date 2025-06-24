import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar.jsx';
import Menu from '../../components/menu';
import Modal_estado_renta from '../../components/modal_estado_renta';
import Modal_recibido from '../../components/modal_recibido';
import axios from 'axios';
import  Modal_detalle from '../../components/modal_detalle'
import Swal from 'sweetalert2';
import { FaSearch } from "react-icons/fa";

export default function historial_rentas() {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal_detalle, setModalDetalle]=useState(false)
  const [modal_estado, setModalEstado]=useState(false)
  const [modal_recibido, setModalRecibido]=useState(false)
  const [estado, setEstado]=useState()
  const [estado_renta, setEstado_renta]=useState()
  console.log(estado_renta);
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [_id, setId]=useState()
  const [loading, setLoading] = useState(true); // Estado de carga

function openModal(){
  setModalDetalle(true)
}
function closeModal(){
  setModalDetalle(false)
}
function openModal_estado(){
  setModalEstado(true)
}
function closeModal_estado(){
  setModalEstado(false)
}
function openModal_recibido(){
  setModalRecibido(true)
}
function closeModal_recibido(){
  setModalRecibido(false)
}

  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [datas]);

  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/rentas/');
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
  async function deleteRenta(_id) {
    try {
      const datitos = { _id: _id };
      if (datitos._id) {
        const confirmation = await Swal.fire({
          title: `¿Estás seguro de eliminar esta renta?`,
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
  
          const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`);
          const datis = data.response?.[0];
          const productos = datis?.productos;
  
          // Solo actualiza el stock si el estado de la renta es diferente de 'Entregado'
          if (datis.estado_renta !== 'Entregado') {
            for (const product of productos) {
              try {
                const productResponse = await axios.get(
                  `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${product._id}`
                );
                const currentStock = productResponse?.data?.response[0]?.stock;
                if (currentStock !== undefined) {
                  const newStock = currentStock + product.cantidad;
                  await axios.put(
                    `https://backrecordatoriorenta-production.up.railway.app/api/products/update/${product._id}`,
                    { stock: newStock }
                  );
                }
              } catch (error) {
                console.error(`Error al actualizar el stock del equipo ${product._id}:`, error);
              }
            }
          }
  
          // Eliminar la renta
          await axios.delete('https://backrecordatoriorenta-production.up.railway.app/api/rentas/delete', {
            data: datitos,
          });
  
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'La renta se ha eliminado',
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.reload();
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo eliminar esta Renta',
          timer: 1500,
        });
      }
    } catch (error) {
      console.log('Error al eliminar la renta:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un problema al eliminar la renta. Intenta nuevamente.',
        timer: 1500,
      });
    }
  }

  useEffect(() => {
    // Filtrado reactivo al cambiar searchTerm o datas
    if (!searchTerm.trim()) {
      setFilteredDatas(datas);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredDatas(
        datas.filter(dat =>
          (dat.nombre && dat.nombre.toLowerCase().includes(term)) ||
          (dat.folio && dat.folio.toLowerCase().includes(term)) ||
          (dat.usuario_rentador && dat.usuario_rentador.toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, datas]);

  // Formatear dinero
  const formatMoney = (num) => {
    if (typeof num !== "number") num = Number(num);
    return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  return (
    <>
      {modal_detalle && (
        <Modal_detalle closeModal={closeModal} _id={_id} />
      )}
      {modal_estado && (
        <Modal_estado_renta closeModal_estado={closeModal_estado} estado={estado}/>
      )}
      {modal_recibido && (
        <Modal_recibido closeModal_recibido={closeModal_recibido} _id={_id} estado={estado_renta}/>
      )}
      <Navbar/>

      <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto w-full py-6 px-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-blue-800 ">Mis Rentas</h1>
            <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2 shadow">
              <FaSearch className="text-blue-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, folio, teléfono..."
                className="outline-none bg-transparent text-blue-700 w-56"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-lg border border-blue-200 bg-white">
            <table className="min-w-max w-full text-[0.95rem]">
              <thead>
                <tr className="bg-blue-700 text-white text-center">
                  <th className="py-3 px-4 whitespace-nowrap">Folio</th>
                  <th className="py-3 px-4 whitespace-nowrap">Nombre</th>
                  <th className="py-3 px-4 whitespace-nowrap">Encargado</th>
                  <th className="py-3 px-4 whitespace-nowrap">Fecha de arriendo</th>
                  <th className="py-3 px-4 whitespace-nowrap">Fecha de Vencimiento</th>
                  <th className="py-3 px-4 whitespace-nowrap">Importe</th>
                  <th className="py-3 px-4 whitespace-nowrap">Estado</th>
                  <th className="py-3 px-4 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-blue-600 font-semibold">
                      No hay rentas registradas.
                    </td>
                  </tr>
                ) : (
                  filteredDatas.map((dat) => (
                    <tr key={dat._id} className="text-center even:bg-blue-50 hover:bg-blue-100 transition">
                      <td className="py-2 px-4 border-b border-blue-100">{dat.folio}</td>
                      <td className="py-2 px-4 border-b border-blue-100">{dat.nombre}</td>
                      <td className="py-2 px-4 border-b border-blue-100">{dat.usuario_rentador}</td>
                      <td className="py-2 px-4 border-b border-blue-100">{dat.fecha_renta}</td>
                      <td className="py-2 px-4 border-b border-blue-100">{dat.fecha_vencimiento}</td>
                      <td className="py-2 px-4 border-b border-blue-100 font-semibold text-blue-700">{formatMoney(Number(dat.total_renta))}</td>
                      <td className="py-2 px-4 border-b border-blue-100">
                        {dat.estado_renta === 'Activo' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {dat.estado_renta}
                          </span>
                        )}
                        {dat.estado_renta === 'Entregado' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {dat.estado_renta}
                          </span>
                        )}
                        {dat.estado_renta === 'Vencido' && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {dat.estado_renta}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b border-blue-100 flex flex-wrap gap-1 justify-center">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 shadow transition"
                          title="Recibir"
                          onClick={() => { openModal_recibido(); setId(dat._id); setEstado_renta(dat.estado_renta); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-plus" viewBox="0 0 16 16">
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zM4 1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5V8a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                          </svg>
                        </button>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-2 py-1 shadow transition"
                          title="Detalles"
                          onClick={() => { openModal(); setId(dat._id); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-exclamation" viewBox="0 0 16 16">
                            <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0m0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                          </svg>
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 shadow transition"
                          title="Eliminar"
                          onClick={() => deleteRenta(dat._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
