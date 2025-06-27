import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { uploadFoto } from "../firebase/images.js";

export default function modalEdit_product({ _id, nombre, closeModal }) {
  const [datas, setDatas] = useState([]);
  const [fotoBase64, setFotoBase64] = useState('');
  const [dato, setDato] = useState();
  const [valorDato, setValorDato] = useState();
  const [loading, setLoading] = useState(true);
  const input_dato = useRef();
  const input_valor_dato = useRef();

  function captureValor_dato() {
    setValorDato(input_valor_dato.current.value);
  }

  function captureDato() {
    setDato(input_dato.current.value);
    setValorDato('');
    if (input_dato.current.value !== 'foto') {
      setFotoBase64(datas[0]?.foto || '');
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setValorDato(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${_id}`);
      setDatas(data.response);
      if (data.response && data.response[0].foto) {
        setFotoBase64(data.response[0].foto);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function editarProducto() {
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espere...',
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    let datos = {
      [dato]: valorDato
    };

    try {
      if (dato === 'foto') {
        const urlFoto = await uploadFoto(valorDato);
        datos = { foto: urlFoto };
      }

      await axios.put(`https://backrecordatoriorenta-production.up.railway.app/api/products/update/${_id}`, datos, {
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
      Swal.close();
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

  return (
    <div className="w-full h-screen absolute z-50 bg-[#d9d9d97b] flex justify-center items-center">
      <div className="bg-white rounded-[10px] w-[90%] lg:w-[40%] h-auto flex flex-col gap-2 py-[1rem] px-[1rem]">
        {loading ? (
          <div className="w-full h-[30vh] flex justify-center items-center">
            <div className='flex flex-col items-center gap-2'>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className='font-semibold'>Cargando datos, por favor espere ...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <button onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col justify-center items-center gap-3">
              {fotoBase64 && (
                <img className="w-[10rem] h-[10rem] object-cover rounded-full" src={fotoBase64} alt="Foto de perfil" />
              )}
              <p className="font-semibold text-[1.2rem] bg-[#adadadc1] text-white px-[2rem] py-[0.5rem] rounded-[10px]">{nombre}</p>
            </div>
            <div className="w-full flex flex-col">
              <div className="mb-3 w-full">
                <label className="form-label">Tipo de dato a editar</label>
                <select ref={input_dato} onChange={captureDato} className="form-select" aria-label="Default select example">
                  <option defaultValue="">Selecciona el dato</option>
                  <option value="nombre">Nombre del equipo</option>
                  <option value="stock">Stock del equipo</option>
                  <option value="codigo">Codigo del equipo</option>
                  <option value="precio">Precio del equipo</option>
                  <option value="foto">Foto del equipo</option>
                </select>
              </div>
              {dato === 'nombre' && (
                <div className="mb-3 w-full">
                  <label className="form-label">Nombre del equipo</label>
                  <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el nuevo nombre del equipo" className="form-control" />
                </div>
              )}
              {dato === 'stock' && (
                <div className="mb-3 w-full">
                  <label className="form-label">Stock del equipo</label>
                  <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el nuevo stock" className="form-control" />
                </div>
              )}
              {dato === 'codigo' && (
                <div className="mb-3 w-full">
                  <label className="form-label">Codigo de equipo</label>
                  <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el codigo nuevo" className="form-control" />
                </div>
              )}
              {dato === 'precio' && (
                <div className="mb-3 w-full">
                  <label className="form-label">Precio del equipo</label>
                  <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Ejemplo 400.00" className="form-control" />
                </div>
              )}
              {dato === 'foto' && (
                <div className="mb-3 w-full">
                  <label className="form-label">Foto</label>
                  <input ref={input_valor_dato} onChange={handleFileChange} type="file" className="form-control" />
                  {fotoBase64 && <img style={{ marginTop: 10, maxHeight: 120 }} src={fotoBase64} alt="preview" />}
                </div>
              )}
              {dato && (
                <div className='w-full flex justify-center'>
                  <button onClick={editarProducto} className='px-[2rem] text-white rounded-[5px] py-[0.5rem] font-semibold bg-primary'>Guardar cambios</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}