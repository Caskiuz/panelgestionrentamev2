import React, { useReducer, useRef } from 'react';
import background from '../images/background_index.jpg'
import logo from '../images/logo.png'
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
export default function index() {
const [usuario,setUsuario]=useState()
const [contraseña,setContraseña]=useState()
const input_usuario=useRef()
const input_contraseña=useRef()
function capture_contraseña(){
setContraseña(input_contraseña.current.value)
}
function capture_ususario(){
setUsuario(input_usuario.current.value)
}
const [showPassword, setShowPassword] = useState(false);
const togglePasswordVisibility = () => {setShowPassword(!showPassword);};
useEffect(() => {
    // Inicializar los tooltips de Bootstrap cada vez que el componente se renderiza o actualiza
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    
    // Limpieza para eliminar tooltips cuando el componente se desmonta
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
              Swal.showLoading(); // Mostrar el indicador de carga
            }
          });
    const { data } = await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/admins/login`, datos);
    
      let token = data.response.token;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', data.response.usuario);
      localStorage.setItem('nombre', data.response.nombre);

      // Redirigir después de la autenticación
      window.location.href = `${window.location.origin}/Homepage`;

      // Cerrar la alerta después de la redirección
      Swal.close();
      return data.response;

    } catch (error) {
      Swal.fire({
        icon:'error',
        title:'Error',
        text:'El usuario o contraseña son incorrectos'
      })
    }
  }

  return (
    <div className='bg-cover w-full h-screen flex justify-center items-center relative ' style={{ backgroundImage: `url(${background})`}}>
        <div className='bg-white lg:w-[35%] w-[90%]  rounded-[10px] items-center flex flex-col px-[2rem] py-[2rem]'>
            <img className='w-[10rem] mb-3' src={logo} alt="" />
            <div class="mb-3 w-full">
                <label for="exampleInputPassword1" class="form-label">Usuario</label>
                <input ref={input_usuario} onChange={capture_ususario} type="text" class="form-control"/>
            </div>
            <div className="mb-3 w-full ">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className='relative flex  items-center'>
                        <input ref={input_contraseña} onChange={capture_contraseña}
                        type={showPassword ? "text" : "password"} 
                        className="form-control " 
                        id="password" 
                    />
                    <span 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                        data-bs-toggle="tooltip"
                        title="Cambiar visibilidad"
                    >
                        {showPassword ? (
                            <svg   xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                            </svg>
                        )}
                    </span>
                    </div>
                </div>
            <div class=" w-full text-[white] font-semibold flex justify-center items-center">
            <button onClick={login} class="bg-[#0D6EFD] hover:bg-[#0d81fd] px-[2rem] py-[0.5rem] rounded-[5px]">Ingresar</button>
            </div>
        </div>
        <div className='text-[white] absolute bottom-1 text-[0.55rem] lg:text-[0.8rem]'><p>©2024-2027 copyright Rentame Carmen-Sistema para la gestión de rentas</p></div>
    </div>
  );
}
