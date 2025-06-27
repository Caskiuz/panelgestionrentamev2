import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios'; // <-- IMPORTANTE
import background from '../images/background_index.jpg';
import logo from '../images/logo.png';
import Swal from 'sweetalert2';
// ICONOS react-icons
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

export default function Index() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const input_usuario = useRef();
  const input_contraseña = useRef();
  const [showPassword, setShowPassword] = useState(false);

  function capture_contraseña() {
    setContraseña(input_contraseña.current.value);
  }
  function capture_usuario() {
    setUsuario(input_usuario.current.value);
  }
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    // Inicializar tooltips bootstrap si existen
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    return () => tooltipList.forEach(tooltip => tooltip.dispose());
  }, [showPassword]);

  async function login() {
    const datos = {
      usuario: usuario,
      contraseña: contraseña
    };
    try {
      Swal.fire({
        title: 'Iniciando sesión...',
        text: 'Por favor espere...',
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
      const { data } = await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/admins/login`, datos);

      let token = data.response.token;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', data.response.usuario);
      localStorage.setItem('nombre', data.response.nombre);

      window.location.href = `${window.location.origin}/Homepage`;
      Swal.close();
      return data.response;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El usuario o contraseña son incorrectos'
      });
    }
  }

  return (
    <div
      className="bg-cover w-full h-screen flex justify-center items-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white lg:w-[35%] w-[90%] rounded-[15px] items-center flex flex-col px-6 py-8 shadow-xl">
        <img className="w-[10rem] mb-3" src={logo} alt="logo" />
        <div className="mb-5 w-full flex flex-col gap-1">
          <label htmlFor="usuario" className="form-label font-semibold text-blue-900 flex items-center gap-2">
            <FaUser className="text-blue-600" /> Usuario
          </label>
          <input
            ref={input_usuario}
            id="usuario"
            autoComplete="username"
            onChange={capture_usuario}
            type="text"
            className="form-control border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Nombre de usuario"
          />
        </div>
        <div className="mb-5 w-full flex flex-col gap-1">
          <label htmlFor="password" className="form-label font-semibold text-blue-900 flex items-center gap-2">
            <FaLock className="text-blue-600" /> Contraseña
          </label>
          <div className="relative flex items-center">
            <input
              ref={input_contraseña}
              onChange={capture_contraseña}
              type={showPassword ? "text" : "password"}
              className="form-control border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              id="password"
              autoComplete="current-password"
              placeholder="Contraseña"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-600"
              onClick={togglePasswordVisibility}
              data-bs-toggle="tooltip"
              title="Mostrar/Ocultar contraseña"
            >
              {showPassword ? (
                <FaEye className="w-5 h-5" />
              ) : (
                <FaEyeSlash className="w-5 h-5" />
              )}
            </span>
          </div>
        </div>
        <div className="w-full flex justify-center items-center mt-2">
          <button
            onClick={login}
            className="bg-[#0D6EFD] hover:bg-[#0d81fd] px-10 py-2 rounded-lg font-bold text-lg text-white shadow transition"
          >
            Ingresar
          </button>
        </div>
      </div>
      <div className="text-white absolute bottom-1 text-xs lg:text-sm text-center w-full">
        <p>
          ©2024-2027 Rentame Carmen - Sistema para la gestión de rentas
        </p>
      </div>
    </div>
  );
}