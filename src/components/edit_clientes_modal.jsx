import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {uploadFoto} from "../firebase/images.js"
import logo from '../images/logo.png';
export default function edit_clientes_modal({ closeModal, _id, nombre }) {
    const [datas, setDatas] = useState([]);
    const [fotoBase64, setFotoBase64] = useState('');
    const [dato, setDato] = useState();
    console.log(dato);
    const [valorDato, setValorDato] = useState();
    const [loading, setLoading] = useState(true);  // Estado para controlar el loader
    const input_dato = useRef();
    const input_valor_dato = useRef();
  
    function captureValor_dato() {
      setValorDato(input_valor_dato.current.value);
    }
  
    function captureDato() {
      setDato(input_dato.current.value);
      setValorDato('');  // Limpiar valorDato cuando se cambia el tipo de dato
      if (input_dato.current.value !== 'foto') {
        setFotoBase64(datas[0]?.foto || '');  // Restaurar foto original si no se está editando la foto
      }
    }
  
    function handleFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        setValorDato(file); // Guardar el archivo seleccionado para subir a Firebase
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoBase64(reader.result); // Mostrar la previsualización de la imagen
        };
        reader.readAsDataURL(file);
      }
    }
  
    async function editarCliente() {
      Swal.fire({
        title: 'Guardando cambios...',
        text: 'Por favor espere...',
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading(); // Mostrar el indicador de carga
        }
      });
    
      let datos = {
        [dato]: valorDato
      };
    
      try {
        if (dato === 'foto_ine_delantero') {
          // Subir imagen a Firebase si el dato es 'foto'
          const urlFoto = await uploadFoto(valorDato); // Suponiendo que valorDato es el archivo
          datos = { foto: urlFoto }; // Actualizar datos con la URL devuelta
        }
        if (dato === 'foto_ine_trasero') {
            // Subir imagen a Firebase si el dato es 'foto'
            const urlFoto = await uploadFoto(valorDato); // Suponiendo que valorDato es el archivo
            datos = { foto: urlFoto }; // Actualizar datos con la URL devuelta
          }
        // Enviamos los datos con axios PUT
        await axios.put(`https://backrecordatoriorenta-production.up.railway.app/api/clients/update/${_id}`, datos, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        Swal.close();
    
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Cambios guardados',
          showConfirmButton: false,
          timer: 1500
        });
    
        closeModal();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un error al guardar los cambios!'
        });
      }
    }
 
return (
<div className="w-full h-screen absolute z-40 bg-[#d9d9d97b] flex justify-center items-center">
    <div className="bg-white rounded-[10px] w-[90%] lg:w-[80%] overflow-y-auto h-[90vh] flex flex-col gap-2 py-[1rem] px-[1rem]">
        <div className="flex justify-between">
            <img className="w-[5rem]" src={logo} alt="" />
            <button onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </button>
        </div>
        <p className="font-semibold text-[1.2rem] bg-[#adadadc1] text-center text-white px-[2rem] py-[0.5rem] rounded-[10px]">{nombre}</p>
        <div className="w-full flex flex-col">
              <div className="mb-3 w-full">
                <label htmlFor="exampleInputPassword1" className="form-label">Tipo de dato a editar</label>
                <select ref={input_dato} onChange={captureDato} className="form-select" aria-label="Default select example">
                  <option selected>Selecciona el dato</option>
                  <option value="nombre">Nombre del cliente</option>
                  <option value="telefono">Numero de telefono</option>
                  <option value="foto_ine_delantero">Foto del INE delantero</option>
                  <option value="foto_ine_trasero">Foto del INE trasero</option>
                  
                </select>
              </div>
              {dato === 'nombre' && (
                <div className="mb-3 w-full">
                  <label htmlFor="exampleInputPassword1" className="form-label">Nombre del Cliente</label>
                  <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el nuevo nombre del cliente" className="form-control" id="exampleInputPassword1" />
                </div>
              )}
              {dato === 'telefono' && (
                <div className="mb-3 w-full">
                  <label htmlFor="exampleInputPassword1" className="form-label">N° telefono o celular</label>
                  <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el número de telefono o celular" className="form-control" id="exampleInputPassword1" />
                </div>
              )}
              {dato === 'foto_ine_delantero' && (
                <div className="mb-3 w-full">
                  <label htmlFor="exampleInputPassword1" className="form-label">Codigo de equipo</label>
                  <input ref={input_valor_dato} onChange={handleFileChange} type="file" placeholder="Escribe el codigo nuevo" className="form-control" id="exampleInputPassword1" />
                </div>
                
              )}
              {dato === 'foto_ine_trasero' && (
                <div className="mb-3 w-full">
                  <label htmlFor="exampleInputPassword1" className="form-label">Precio del equipo</label>
                  <input ref={input_valor_dato} onChange={handleFileChange} type="file" placeholder="Ejemplo 400.00" className="form-control" id="exampleInputPassword1" />
                </div>
                
              )}
              
              {dato && (
                <div className='w-full flex justify-center'>
                  <button onClick={editarCliente} className='px-[2rem] text-white rounded-[5px] py-[0.5rem] font-semibold bg-primary'>Guardar cambios</button>
                </div>
              )}
            </div>
    </div>
</div>
  );
}
