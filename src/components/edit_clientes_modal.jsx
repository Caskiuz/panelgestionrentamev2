import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { uploadFoto } from "../firebase/images.js";
import logo from '../images/logo.png';

export default function edit_clientes_modal({ closeModal, _id, nombre }) {
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
    if (input_dato.current.value !== 'foto_ine_delantero' && input_dato.current.value !== 'foto_ine_trasero') {
      setFotoBase64(datas[0]?.foto_ine_delantero || '');
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

  async function editarCliente() {
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
      if (dato === 'foto_ine_delantero' || dato === 'foto_ine_trasero') {
        const urlFoto = await uploadFoto(valorDato);
        datos = { [dato]: urlFoto };
      }

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/clients/read_especific?_id=${_id}`);
        setDatas(data.response);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    fetchData();
  }, [_id]);

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
            <label className="form-label">Tipo de dato a editar</label>
            <select ref={input_dato} onChange={captureDato} className="form-select" aria-label="Default select example">
              <option defaultValue="">Selecciona el dato</option>
              <option value="nombre">Nombre del cliente</option>
              <option value="telefono">Numero de telefono</option>
              <option value="foto_ine_delantero">Foto del INE delantero</option>
              <option value="foto_ine_trasero">Foto del INE trasero</option>
            </select>
          </div>
          {dato === 'nombre' && (
            <div className="mb-3 w-full">
              <label className="form-label">Nombre del Cliente</label>
              <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el nuevo nombre del cliente" className="form-control" />
            </div>
          )}
          {dato === 'telefono' && (
            <div className="mb-3 w-full">
              <label className="form-label">N° telefono o celular</label>
              <input ref={input_valor_dato} onChange={captureValor_dato} type="text" placeholder="Escribe el número de telefono o celular" className="form-control" />
            </div>
          )}
          {dato === 'foto_ine_delantero' && (
            <div className="mb-3 w-full">
              <label className="form-label">Foto INE delantero</label>
              <input ref={input_valor_dato} onChange={handleFileChange} type="file" className="form-control" />
              {fotoBase64 && <img style={{ marginTop: 10, maxHeight: 120 }} src={fotoBase64} alt="preview" />}
            </div>
          )}
          {dato === 'foto_ine_trasero' && (
            <div className="mb-3 w-full">
              <label className="form-label">Foto INE trasero</label>
              <input ref={input_valor_dato} onChange={handleFileChange} type="file" className="form-control" />
              {fotoBase64 && <img style={{ marginTop: 10, maxHeight: 120 }} src={fotoBase64} alt="preview" />}
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