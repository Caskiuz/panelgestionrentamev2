import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {uploadFoto} from "../firebase/images.js"
import editar_clientes from './modal_clientes/editar_clientes.jsx';
export default function modalEdit({ usuario, closeModal, gett }) {
  const user=usuario
  const [datas, setDatas] = useState([]);
  const [foto, setFoto] = useState();
  const [foto_temporal, setFoto_temporal] = useState();
  const [loading, setLoading] = useState(true); 
  const [nombre_usuario, setNombre_usuario]=useState()
  const [nombre_completo, setNombre_completo]=useState()
  const [contraseña, setContraseña]=useState('***************')
  const [rol, setRol]=useState()
  const [modal_change_foto, setModal_change_foto]=useState(false)
  const [edit_usuario, setEdit_usuario ]=useState(false)
  const [edit_contraseña, setEdit_contraseña ]=useState(false)
  const [edit_nombre_completo, setEdit_nombre_completo ]=useState(false)
  const [edit_rol, setEdit_rol ]=useState(false)
  const input_foto=useRef()
 
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto_temporal(file); // Actualiza la previsualización de la foto
    }
  };
  
  const handleSaveFoto = async () => {
    if(foto_temporal){
      setFoto(foto_temporal)
      closeModal_change_foto()
    }
  };
  
  function openModal_change_foto(){
    setModal_change_foto(true)
  }
 function closeModal_change_foto(){
  setModal_change_foto(false)
  }
  
  async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/read_especific2?_id=${usuario}`);
      setDatas(data.response);
      setNombre_completo(data.response[0].nombre)
      setNombre_usuario(data.response[0].usuario)
      setRol(data.response[0].rol)
      setFoto(data.response[0].foto)
      // if (data.response && data.response[0].foto) {
      //   setFotoBase64(data.response[0].foto); // Aquí asumimos que 'foto' contiene la cadena base64
      // }
      setLoading(false);  // Desactivar el loader cuando los datos se han cargado
    } catch (error) {
      console.error('Error fetching image data:', error);
      setLoading(false);  // También desactivar el loader en caso de error
    }
  }
  
  async function editarContraseña(valor) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
  
  try {
      
        const datos={
          contraseña:valor
        }
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/admins/updatePassword/${usuario}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      
  
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
     await gett()

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }

  
  async function editarFoto_perfil(e) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
    const file = foto_temporal
    console.log(file);
    const foto_url=await uploadFoto(file)
console.log(foto_url);
  try {
      
        const datos={
          foto:foto_url || ''
        }
        console.log(datos.foto);
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/admins/update/${usuario}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      setFoto(foto_url)
        await gett()
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
      closeModal_change_foto()

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }


  async function editarUsuario(tipo_dato,valor) {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });
  
  try {
      
        const datos={
          [tipo_dato]:valor
        }
        await axios.put(
          `https://backrecordatoriorenta-production.up.railway.app/api/admins/update/${usuario}`, datos,
          { headers: { 'Content-Type': 'application/json' } }
        );
      
  
      Swal.close();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500
      });
     await gett()

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al guardar los cambios!'
      });
    }
  }

useEffect(() => {
  get();
}, []);
function handleEnterPress(event, valor, dato) {
  if (event.key === 'Enter') {
  editarUsuario(valor, dato)
    switch (valor) {
      case 'usuario':
        setEdit_usuario(false);
        break;
      case 'nombre':
        setEdit_nombre_completo(false);
        break;
        case 'contraseña':
        setEdit_contraseña(false);
        break;
        case 'rol':
        setEdit_rol(false);
        break;
      default:
        console.log('No se reconoce el caso:', valor);
    }
  }
}
  return (
    <>
    {modal_change_foto === true && (
      <div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
        <div className='flex flex-col items-center w-[90%] lg:w-[35%] gap-3 bg-white py-[1rem] px-[1rem]'>
          <p className=' font-semibold'>Selecciona una nueva foto</p>
          <input ref={input_foto} onChange={handleFotoChange}  class="form-control" type="file" id="formFile"/>
          <div className='flex w-full justify-between'>
          <button  onClick={editarFoto_perfil} className='bg-success text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Guardar</button>
          <button  onClick={closeModal_change_foto} className='bg-[#808080] text-white font-semibold px-[1rem] py-[0.3rem] rounded-[5px]'>Cancelar</button>
          </div>
        </div>
      </div>
    )}
    <div className="w-full lg:h-screen absolute z-40 bg-[#d9d9d97b] flex lg:py-0 py-[2rem] justify-center items-center">
      <div className="bg-white rounded-[10px] w-[90%] lg:w-[45%] h-auto flex flex-col">
        <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
          <p className='text-white font-semibold'>Editar Usuarios</p>
          <button onClick={closeModal}>
            <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
          </button>
        </div>
        
          <div className='w-full flex py-[1rem] gap-4 lg:flex-row flex-col '>
          {/* //PARTE DE LA foto */}
          <div className='lg:w-[30%] w-full flex justify-center'>
            <div className='w-full items-center gap-2 flex flex-col'>
              <img src={foto} className="w-[7rem] h-[7rem] rounded-full" />
              <button onClick={openModal_change_foto} className='flex gap-1 items-center bg-[#808080]  px-[1rem] rounded-[5px] py-[0.3rem] justify-center text-white'><svg class="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
</svg> Cambiar foto
</button>
            </div>
          </div>
          <div className='w-full lg:w-[70%] px-[1.5rem]'>
            <p className='font-semibold text-[1.3rem] underline pb-3'>Datos del usuario</p>
            <div className='flex flex-col'>
            <div className="mb-2">
      <label htmlFor="exampleInputEmail1" className="form-label">
        Usuario
      </label>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex gap-1">
          {/* Input deshabilitado dinámicamente */}
          <input
            placeholder="Escribe el nuevo nombre de usuario"
            value={nombre_usuario}
            onKeyPress={(event)=>{handleEnterPress(event,'usuario',nombre_usuario)}}
            onChange={(e) => setNombre_usuario(e.target.value)}
            className={`w-full border rounded p-2 ${!edit_usuario ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            type="text"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            disabled={!edit_usuario} // Deshabilitado si no se está editando
          />
          {/* Botón para habilitar la edición */}
          <button  onClick={() => setEdit_usuario(true)} className="flex gap-1 items-center underline">
            <svg
              className="w-6 h-6 text-[#808080]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </button>
        </div>
        {/* Botones de guardar/cancelar */}
        {edit_usuario && (
          <div className="flex gap-2 text-[0.8rem]">
            <button
              onClick={() => {setEdit_usuario(false)}}
              className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  <div className="mb-2">
  <label htmlFor="exampleInputEmail1" className="form-label">
    Nombre completo
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Input deshabilitado dinámicamente */}
      <input
        placeholder="Escribe el nuevo nombre"
        value={nombre_completo}
        onChange={(e) => setNombre_completo(e.target.value)}
        onKeyPress={(event)=>{handleEnterPress(event,'nombre',nombre_completo)}}
        type="text"
        className={`form-control ${!edit_nombre_completo ? 'bg-gray-200 cursor-not-allowed' : ''}`}
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        disabled={!edit_nombre_completo} // Deshabilitado si no se está editando
      />
      {/* Botón para habilitar la edición */}
      <button
        className="flex gap-1 items-center underline"
        onClick={() => setEdit_nombre_completo(true)}
      >
        <svg
          className="w-6 h-6 text-[#808080]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
    </div>
    {/* Botones de guardar/cancelar */}
    {edit_nombre_completo && (
      <div className="flex gap-2 text-[0.8rem]">
        <button
          onClick={() => {setEdit_nombre_completo(false)}} // Cancelar y deshabilitar
          className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
        >
          Cancelar
        </button>
      </div>
    )}
  </div>
</div>

<div className="mb-2">
  <label htmlFor="exampleInputPassword1" className="form-label">
    Contraseña
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Input deshabilitado dinámicamente */}
      <input
        placeholder="Escribe la nueva contraseña"
        value={contraseña}
        onKeyPress={(event)=>{handleEnterPress(event,'contraseña',contraseña)}}
        onChange={(e) => setContraseña(e.target.value)}
        type="password"
        className={`w-full border rounded p-2 ${!edit_contraseña ? 'bg-gray-200 cursor-not-allowed' : ''}`}
        id="exampleInputPassword1"
        aria-describedby="emailHelp"
        disabled={!edit_contraseña} // Deshabilitado si no se está editando
      />
      {/* Botón para habilitar la edición */}
      <button
        className="flex gap-1 items-center underline"
        onClick={() => {setEdit_contraseña(true), setContraseña('')}} // Habilitar la edición
      >
        <svg
          className="w-6 h-6 text-[#808080]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
    </div>
    {/* Botones de guardar/cancelar */}
    {edit_contraseña && (
      <div className="flex gap-2 text-[0.8rem]">
        <button
          onClick={() => {setEdit_contraseña(false), setContraseña('***************')}} // Cancelar y deshabilitar
          className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
        >
          Cancelar
        </button>
      </div>
    )}
  </div>
</div>

<div className="mb-2">
  <label htmlFor="exampleInputRol" className="form-label">
    Rol de usuario
  </label>
  <div className="w-full flex flex-col gap-2">
    <div className="w-full flex gap-1">
      {/* Input deshabilitado dinámicamente */}
      <input
        placeholder="Escribe el nuevo rol"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        type="number"
        onKeyPress={(event)=>{handleEnterPress(event,'rol',rol)}}
        className={`w-full border rounded p-2 ${!edit_rol ? 'bg-gray-200 cursor-not-allowed' : ''}`}
        id="exampleInputRol"
        aria-describedby="emailHelp"
        disabled={!edit_rol} // Deshabilitado si no se está editando
      />
      {/* Botón para habilitar la edición */}
      <button
        className="flex gap-1 items-center underline"
        onClick={() => setEdit_rol(true)} // Habilitar la edición
      >
        <svg
          className="w-6 h-6 text-[#808080]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
    </div>
    {/* Botones de guardar/cancelar */}
    {edit_rol && (
      <div className="flex gap-2 text-[0.8rem]">
        <button
          onClick={() => {setEdit_rol(false)}} // Cancelar y deshabilitar
          className="bg-[#808080] px-[1rem] py-[0.3rem] text-white rounded-[5px]"
        >
          Cancelar
        </button>
      </div>
    )}
  </div>
  <div id="emailHelp" className="form-text">
    1=Administrador 2=Empleado
  </div>
</div>

  <div class="pb-4 pt-[1rem] flex justify-between">
  <button onClick={closeModal} className='bg-[#808080] px-[1rem] py-[0.3rem] text-white font-semibold rounded-[5px]'>Cerrar</button>
  </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    </>
  );
}
