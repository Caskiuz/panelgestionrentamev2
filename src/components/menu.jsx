import React, { useEffect, useState } from 'react';
import logo from '../images/logo_blanco.png'
import icon_user from '../images/icon_user.png'
import box from '../images/box.png'
import icon_bolsa from '../images/icon_bolsa.png'
import axios from 'axios';

export default function Menu({closeMenu}) {
const [modal_usuarios, setModal_usuarios] = useState(false);
const [modal_productos, setModal_productos] = useState(false);
const [modal_rentas, setModal_rentas] = useState(false);
const [modal_clientes, setModal_clientes] = useState(false);
const [datas, setDatas]=useState([])
const toggleListVisibility = () => {setModal_usuarios(prev => !prev);};
const toggleListVisibility2 = () => {setModal_productos(prev => !prev);};
const toggleListVisibility3 = () => {setModal_rentas(prev => !prev);};
const toggleListVisibility4 = () => {setModal_clientes(prev => !prev);};
async function get() {
  const usuario=localStorage.getItem('usuario')
 
  try {
    const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific?usuario=${usuario}`);
    setDatas(data.response)
  } catch (error) {
    console.error('Error fetching image data:', error);
  }
}

useEffect(() => {
 get()
}, []);
  return (
  <>
   {datas.map(dat=>(
    <div className="absolute z-50 top-0 left-0 bg-[#323B75] pr-3 w-[80%] lg:w-auto h-screen flex flex-col shadow-2xl rounded-r-2xl">
  {/* Header */}
  <div className="w-full flex items-center bg-[#323B75] justify-between border-b border-white/20 h-[4.5rem] px-4">
    <a href="/Homepage">
      <img className="w-20" src={logo} alt="" />
    </a>
    <button onClick={closeMenu} className="hover:bg-white/10 rounded-full p-1 transition">
      <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
      </svg>
    </button>
  </div>
  {/* Opciones del menú */}
  <nav className="flex-1 flex flex-col gap-2 py-4">
    {/* Usuarios */}
    {dat.rol === 1 && (
      <a href="/users_panel" className="flex items-center gap-3 text-white px-3 py-3 rounded-lg hover:bg-blue-800 transition font-medium mx-2">
        <img className="w-8" src={icon_user} alt="" />
        Crear / editar usuarios
      </a>
    )}
    {/* Clientes */}
    <a href="/clients_panel" className="flex items-center gap-3 text-white px-3 py-3 rounded-lg hover:bg-blue-800 transition font-medium mx-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" className="bi bi-database" viewBox="0 0 16 16">
        <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"/>
      </svg>
      Crear / editar clientes
    </a>
    {/* Equipos */}
    {dat.rol === 1 && (
      <a href="/products_panel" className="flex items-center gap-3 text-white px-3 py-3 rounded-lg hover:bg-blue-800 transition font-medium mx-2">
        <img className="w-8" src={box} alt="" />
        Crear / editar equipos
      </a>
    )}
    {/* Lista de equipos para rol 2 */}
    {dat.rol === 2 && (
      <a href="/product_list" className="flex items-center gap-3 text-white px-3 py-3 rounded-lg hover:bg-blue-800 transition font-medium mx-2">
        <img className="w-8" src={box} alt="" />
        Lista de equipos
      </a>
    )}
    {/* Notas de Remisión */}
    <div className="mx-2">
      <button
        onClick={toggleListVisibility4}
        className="w-full flex justify-between items-center px-3 py-3 rounded-lg gap-3 text-white hover:bg-blue-800 transition font-medium focus:outline-none"
        type="button"
      >
        <span className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
            <path d="M5 7h6v1H5V7zm0 2h6v1H5V9zm0 2h4v1H5v-1z"/>
            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3-.5a.5.5 0 0 1-.5-.5V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5h-2.5A1.5 1.5 0 0 1 11 4z"/>
          </svg>
          Rentas & Notas de Remisión
        </span>
        <svg className={`w-6 h-6 transition-transform duration-300 ${modal_clientes ? 'rotate-90' : ''} text-white`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
        </svg>
      </button>
      {/* Submenú notas de remisión */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-blue-900/80 rounded-b-lg shadow-lg ${modal_clientes ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}>
        <ul className="flex flex-col gap-2 px-6">
          
          <a href="/create_notas_rentas">
            <li className="text-blue-100 hover:text-white hover:bg-blue-700 rounded px-3 py-2 transition cursor-pointer font-medium">Generar Rentas & notas de remisión</li>
          </a>
          <a href="/hist_renta">
            <li className="text-blue-100 hover:text-white hover:bg-blue-700 rounded px-3 py-2 transition cursor-pointer font-medium">Mis rentas</li>
          </a>
          <a href="/notas_remision">
            <li className="text-blue-100 hover:text-white hover:bg-blue-700 rounded px-3 py-2 transition cursor-pointer font-medium">Mis notas de remisión</li>
          </a>
        </ul>
      </div>
    </div>
  </nav>
</div>
   ))}
  </>
  );
}
