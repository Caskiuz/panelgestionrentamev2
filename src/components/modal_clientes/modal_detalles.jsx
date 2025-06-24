import axios from 'axios';
import React, { useEffect, useState } from 'react';
export default function modal_detalles({_id, closeModal_detalles}) {
    const [datas, setDatas] = useState([]);
    console.log(datas);
        const [loading, setLoading] = useState(true);
    async function get() {
        try {
          const { data } = await axios.get(
            `https://backrecordatoriorenta-production.up.railway.app/api/clients/read_especific?_id=${_id}`
          );
          setDatas(data.response);
          setLoading(false); // Desactivar el loader cuando los datos se han cargado
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Desactivar el loader también en caso de error
        }
      }
    
      useEffect(() => {
        get();
      }, []);
return (
    <div className="w-full lg:h-screen absolute z-40 bg-[#d9d9d97b] flex justify-center items-center lg:py-0 py-[2rem]">
        <div className="bg-white rounded-[10px] w-[90%] lg:w-[35%] h-auto flex flex-col">
            <div className='bg-[gray] flex justify-between px-[1rem] items-center py-[0.5rem] border-b-[1px] border-b-[black] border-solid'>
                <p className='text-white font-semibold'>Detalles del cliente</p>
                <button onClick={closeModal_detalles}>
                <svg class="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
               </button>
            </div>
            {datas.map(dat=>(
            <>
            <div className='w-full flex flex-col py-[1rem] px-[1rem] gap-3'>
                <div className='flex gap-1'>
                    <p className='font-semibold flex gap-1'>
                        <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
                        </svg>
                        Nombre del cliente:</p>
                    <p className='text-secondary'>{dat.nombre}</p>
                </div>
                 <div className='w-full flex flex-col'>
            <div className='flex gap-1'>
                <p className='font-semibold flex gap-1'>
                    <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
                    </svg>
                    WhatsApp:</p>
                <p className='text-secondary'>{dat.telefono}</p>
            </div>
            </div>
            <div className='flex gap-1 flex-col'>
                <p className='font-semibold flex gap-1'>
                    <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clip-rule="evenodd"/>
                    </svg>
                    Foto INE delantero:</p>
                <a target='_blank' href={dat.foto_ine_delantero}>
                    <img className='w-[35%]' src={dat.foto_ine_delantero} alt="" />
                </a>
            </div>
            <div className='flex gap-1 flex-col'>
                <p className='font-semibold flex gap-1'>
                    <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clip-rule="evenodd"/>
                    </svg>
                    Foto INE trasero:</p>
                <a target='_blank' href={dat.foto_ine_trasero}>
                    <img className='w-[35%]' src={dat.foto_ine_trasero} alt="" />
                </a>
            </div>
            </div>
           
            </>
            ))}
        </div>
    </div>
);}
