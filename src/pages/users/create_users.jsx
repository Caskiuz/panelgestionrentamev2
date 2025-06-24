import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/navbar';
import Menu from '../../components/menu';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import {uploadFoto} from '../../firebase/images.js'
import Swal from 'sweetalert2';
export default function create_users() {
    const notyf = new Notyf({
        position: {
          x: 'center',
          y: 'top',
        },
        duration:3500
      });
const [foto, setFoto]=useState()
const [fotoBuffer, setFotoBuffer]=useState()

const [usuario, setUsuario]=useState()
console.log(usuario);
const [contraseña, setContraseña]=useState()
const [rol, setRol]=useState()
const [nombre_completo, setNombre_completo]=useState()
const [showPassword, setShowPassword] = useState(false);

const input_foto=useRef()
const input_contraseña=useRef()
const input_rol=useRef()
const input_usuario=useRef()
const input_nombre=useRef()

const togglePasswordVisibility = () => {setShowPassword(!showPassword);};
useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    return () => tooltipList.forEach(tooltip => tooltip.dispose());
}, [showPassword]);

const capture_ususario = () => {
setUsuario(input_usuario.current.value.trim())
}
const capture_nombre = () => {
    setNombre_completo(input_nombre.current.value.trim())
    }
const capture_contraseña = () => {
setContraseña(input_contraseña.current.value)
}
const capture_rol = () => {
setRol(input_rol.current.value)
}
const capture_foto = () => {
const file = input_foto.current.files[0];
    if (file) {
        const blobURL = URL.createObjectURL(file);
        setFoto(blobURL);  // Muestra la imagen previa al subir
    }
};


async function crearUsuario() {
    Swal.fire({
        title: 'Cargando, por favor espere...',
        didOpen: () => {
          Swal.showLoading();  // Mostrar el spinner de carga
        }
      });
    if (!usuario || !contraseña || !rol || !nombre_completo) {
        return alert('Todos los campos son requeridos');
    }
    let fotoURL = ''; // Variable temporal para almacenar la URL de la foto

    // Verifica si hay un archivo seleccionado y sube la foto
    const selectedFile = input_foto.current.files[0];
    if (selectedFile) {
        try {
            fotoURL = await uploadFoto(selectedFile); // Sube la foto y obtiene la URL
            console.log('URL de descarga:', fotoURL);
        } catch (error) {
            notyf.error('Error al subir la foto. Intente nuevamente.');
            return;
        }
    }

    // Si hay foto o si se permite enviar sin foto
    const datos = {
        usuario: usuario,
        rol: rol,
        contraseña: contraseña,
        nombre:nombre_completo,
        foto: fotoURL || null, // Envía la URL o null si no se seleccionó una foto
    };

    try {
        await axios.post(`https://backrecordatoriorenta-production.up.railway.app/api/admins/create`, datos);
        notyf.success('El usuario se creó con éxito. Se recargará esta página en 1 segundo.');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error(error);
        notyf.error('Este usuario ya existe en la base de datos, intente con otro.');
    }
}

return (
<>
    <Navbar/>
    <div className='w-full flex justify-center items-center bg-[#d2d2d2] relative lg:py-[1.5rem] py-[1rem]  lg:h-auto'>
        <div className='bg-[white] w-[90%] lg:w-[35%] rounded-[10px] items-center flex flex-col  px-[1.5rem] py-[1rem]'>
        {!foto && (
            <div className=' w-[7rem] h-[7rem]  bg-gray-200 text-[white] border-solid border-[2px] rounded-full'>
                <svg  xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
            </div>
        )}
        {foto && (
            <div className=' w-[7rem] h-[7rem] bg-gray-200 text-[white] border-solid border-[2px] rounded-full'>
                <img className='rounded-full w-full h-full' src={foto} alt="" />
            </div>
        )}
            <div class="mb-3 w-full">
                <label for="exampleInputPassword1" class="form-label">Usuario</label>
                <input ref={input_usuario} onChange={capture_ususario} type="text" class="form-control" id="exampleInputPassword1"/>
            </div>
            <div class="mb-3 w-full">
                <label for="exampleInputPassword1" class="form-label">Nombre completo</label>
                <input ref={input_nombre} onChange={capture_nombre} placeholder='Escribe el nombre del encargado' type="text" class="form-control" id="exampleInputPassword1"/>
            </div>
            <div className="mb-3 w-full ">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <div className='relative flex  items-center'>
                    <input ref={input_contraseña} onChange={capture_contraseña} type={showPassword ? "text" : "password"} className="form-control" id="password"/>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility} data-bs-toggle="tooltip" title="Cambiar visibilidad">
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
            <div class="mb-3 w-full">
                <label for="exampleInputPassword1" class="form-label">Foto (opcional)</label>
                <input type="file" ref={input_foto} onChange={capture_foto} class="form-control" id="exampleInputPassword1"/>
            </div>
            <div class="mb-3 w-full">
                <label for="exampleInputPassword1" class="form-label">Rol de usuario</label>
                <select ref={input_rol} onChange={capture_rol} class="form-select" aria-label="Default select example">
                    <option selected>Selecciona el rol</option>
                    <option value="1">Aministrador</option>
                    <option value="2">Empleado</option>
                </select>
            </div>
            <div className="flex justify-center items-center w-full pt-[1rem]">
                <button onClick={crearUsuario} className='bg-[#0D6EFD] font-semibold text-white px-[2rem] py-[0.5rem] rounded-[10px] hover:bg-[#0d89fd]'>Crear usuario</button>
            </div>
        </div>
    </div>
</>
);}
