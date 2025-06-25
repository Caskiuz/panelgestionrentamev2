import React, { useEffect, useState } from 'react';
import icon_logout from '../images/icon_logout.png'; // Revisa si sigue siendo necesario si ya no usas este botón
import Menu from './menu';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthAndMetrics } from '../context/AuthAndMetricsContext'; // ¡NUEVA IMPORTACIÓN!

export default function Navbar() { // Cambiado 'navbar' a 'Navbar' por convención de React
  const { userData, isLoading } = useAuthAndMetrics(); // ¡OBTENEMOS LOS DATOS DEL CONTEXTO!
  const [fotoBase64, setFotoBase64] = useState(''); // Mantenemos el estado local para la foto si se maneja aquí
  const [menu, setMenu] = useState(false);

  function openMenu() {
    setMenu(true);
  }
  function closeMenu() {
    setMenu(false);
  }

  // Si la foto base64 viene en userData, la actualizamos
  useEffect(() => {
    if (userData && userData.foto) {
      setFotoBase64(userData.foto);
    }
  }, [userData]); // Se actualiza cuando userData cambia

  // Eliminamos la función 'get' y el 'useEffect' que la llamaba,
  // ya que los datos se obtienen del contexto.
  // async function get() { ... }
  // useEffect(() => { get(); }, []);

  // useEffect para Tooltip (se mantiene si Bootstrap Tooltips son gestionados así)
  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [userData]); // Depende de userData para que se refresquen los tooltips

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

  // Si los datos están cargando, puedes mostrar un spinner o nada
  if (isLoading) {
    return (
      <div className='w-full h-[12vh] lg:h-[10vh] bg-[#C70000] flex justify-end px-[1rem] items-center text-white font-semibold'>
        Cargando usuario...
      </div>
    );
  }

  // Si no hay userData (ej. no logueado), puedes renderizar una versión simplificada de la navbar
  if (!userData) {
    return (
      <div className='w-full h-[12vh] lg:h-[10vh] bg-[#C70000] flex justify-end px-[1rem] items-center text-white font-semibold'>
        {/* Puedes añadir un botón de login aquí si quieres */}
        Usuario no logueado
      </div>
    );
  }

  return (
    <>
      {menu === true && (
        <Menu closeMenu={closeMenu}/>
      )}
      {/* Usamos userData directamente */}
      <div className='w-full h-[12vh] lg:h-[10vh] bg-[#C70000] flex justify-between px-[1rem] lg:gap-5 items-center text-white font-semibold relative'>
        <button onClick={openMenu}>
          <svg className="lg:w-10 lg:h-10 w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </button>
        <div className='flex gap-3 items-center'>
          <p className='flex items-center lg:text-[1rem] text-[0.8rem] font-normal '>{userData.nombre}</p> {/* ¡Nombre del usuario logueado! */}
          {fotoBase64 ? (
            <button data-bs-toggle="tooltip" data-bs-title="Mi perfil"><img className='w-[2rem] h-[2rem] lg:w-[2.5rem] lg:h-[2.5rem] rounded-full' src={fotoBase64} alt="Foto de perfil"/></button>
          ) : (
            <button className='w-[2.5rem] h-[2.5rem] rounded-full bg-gray-100' data-bs-toggle="tooltip" data-bs-title="Ver perfil">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
            </button>
          )}
          <div className="dropdown">
            <button className="btn-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd"/>
              </svg>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a onClick={LogOut} className="dropdown-item flex gap-2" href="#">
                  <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
                  </svg>
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
