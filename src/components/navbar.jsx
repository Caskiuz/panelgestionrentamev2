import React, { useEffect, useState } from 'react';
import Menu from './menu';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthAndMetrics } from '../context/AuthAndMetricsContext';
// ICONOS
import { FaSignOutAlt, FaUserCircle, FaBars, FaSpinner } from "react-icons/fa";

export default function Navbar() {
  const { userData, isLoading } = useAuthAndMetrics();
  const [fotoBase64, setFotoBase64] = useState('');
  const [menu, setMenu] = useState(false);

  function openMenu() {
    setMenu(true);
  }
  function closeMenu() {
    setMenu(false);
  }

  useEffect(() => {
    if (userData && userData.foto) {
      setFotoBase64(userData.foto);
    }
  }, [userData]);

  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [userData]);

  async function LogOut() {
    const token = localStorage.getItem('token');
    try {
      Swal.fire({
        title: 'Cerrando sesión...',
        text: 'Hasta pronto!',
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
      await axios.post('https://backrecordatoriorenta-production.up.railway.app/api/admins/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = `${window.location.origin}/`;
      Swal.close();
    } catch (error) {
      Swal.close();
      console.log('No se cerró la sesión');
    }
  }

  if (isLoading) {
    return (
      <div className='w-full h-[12vh] lg:h-[10vh] bg-[#C70000] flex justify-end px-4 items-center text-white font-semibold'>
        <FaSpinner className="animate-spin mr-2" /> Cargando usuario...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='w-full h-[12vh] lg:h-[10vh] bg-[#C70000] flex justify-end px-4 items-center text-white font-semibold'>
        Usuario no logueado
      </div>
    );
  }

  return (
    <>
      {menu && <Menu closeMenu={closeMenu} />}
      <div className='w-full h-[12vh] lg:h-[10vh] bg-[#C70000] flex justify-between px-4 lg:gap-5 items-center text-white font-semibold relative shadow'>
        <button onClick={openMenu} className="focus:outline-none">
          <FaBars className="lg:w-10 lg:h-10 w-7 h-7 text-white" />
        </button>
        <div className='flex gap-3 items-center'>
          <p className='flex items-center lg:text-[1rem] text-[0.8rem] font-normal'>
            {userData.nombre}
          </p>
          {fotoBase64 ? (
            <button data-bs-toggle="tooltip" data-bs-title="Mi perfil">
              <img className='w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] rounded-full object-cover border-2 border-white shadow' src={fotoBase64} alt="Foto de perfil" />
            </button>
          ) : (
            <button className='w-[2.5rem] h-[2.5rem] rounded-full bg-gray-100 flex items-center justify-center' data-bs-toggle="tooltip" data-bs-title="Ver perfil">
              <FaUserCircle className="w-8 h-8 text-gray-400" />
            </button>
          )}
          <div className="dropdown">
            <button className="btn-secondary focus:outline-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd"/>
              </svg>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a onClick={LogOut} className="dropdown-item flex gap-2 items-center cursor-pointer" href="#">
                  <FaSignOutAlt className="w-6 h-6 text-gray-700" />
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}