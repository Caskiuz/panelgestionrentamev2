import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {PDFDownloadLink} from '@react-pdf/renderer';

import Lightbox from './ligthbox';
import Ficha from '../pages/PDF/ficha_tecnica';
import ficha_tecnica from '../images/ficha_tecnica.jpg'
export default function detalle_productos({closeModal, id}) {
  console.log(id);
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombre, setNombre]=useState()
    console.log(nombre);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    async function get() {
        try {
          const { data } = await axios.get(
            `https://backrecordatoriorenta-production.up.railway.app/api/products/read_especific?_id=${id}`
          );
          setDatas(data.response);
          setNombre(data?.response[0].nombre)
          setLoading(false); // Desactivar el loader cuando los datos se han cargado
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Desactivar el loader también en caso de error
        }
      }
    
      useEffect(() => {
        get();
      }, []);
      const openLightbox = (imageSrc) => {
        setCurrentImage(imageSrc);
        setIsOpen(true);
      };
    
      const closeLightbox = () => {
        setIsOpen(false);
      };
  return (
    <>
    {isOpen && (
       <Lightbox
       isOpen={isOpen}
       closeLightbox={closeLightbox}
       currentImage={currentImage}
     />
    )}
      <div className="w-full h-screen absolute z-40 bg-[#d9d9d97b] flex justify-center items-center">
        <div className="bg-white rounded-[10px] w-[90%] lg:w-[30%] overflow-y-auto flex flex-col gap-2 pt-[1rem] px-[1rem]">
          <div className="flex justify-between">
          <PDFDownloadLink
            className=''
             document={<Ficha _id={id} />}
             fileName={`Ficha tecnica-${nombre}.pdf`}
             >
             {({ loading}) =>
          loading ?
              <div className='w-full  flex justify-center items-center'>
                 <div className='flex flex-col gap-2 items-center'>
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p>Generando PDF</p>
                 </div>
              </div> 
              :
              <>
              {id  && (
                <div className='w-full  flex justify-center items-center'>
                <button  className='bg-[#004AAD] px-[1rem] hover:bg-[#4590f1] py-[0.3rem] flex gap-1 text-[0.8rem] items-center text-white font-semibold rounded-[5px]'><svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
</svg>
Descargar Ficha técnica</button>
              </div>
              )}
              </>
        }
      </PDFDownloadLink>
            <button onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </svg>
            </button>
          </div>

          {/* Mostrar loader mientras se cargan los datos */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              
              {datas.map((dat) => (
                <div className="flex flex-col gap-3  text-[0.9rem] items-center pt-[1rem] " >
                  <div className='relative w-full'>
                    <img className='w-full' src={ficha_tecnica} alt="" />
                    <div className='w-[85%] absolute top-[13.8%] left-[7%] h-[5.8%] flex justify-center items-center text-[0.35rem] lg:text-[0.7rem]'>
                      <p className='font-semibold'>{dat.nombre.toUpperCase()}</p>
                    </div>
                    <div className='w-[43%] absolute top-[22.7%] left-[49%] h-[21%]'>
                      <img className='w-full h-[100%]' src={dat.foto}/>
                    </div>
                    <div className='absolute top-[29%] w-[38.5%] h-[15%] pl-1 flex flex-col justify-center lg:gap-1 left-[6.8%] text-[0.4rem] lg:text-[0.6rem] font-bold'> 
                    <p className='font-bold'>CODIGO DEL EQUIPO:</p>
                    <p className=''>{dat.codigo}</p>
                    <p className='font-bold'>PRECIO DEL EQUIPO:</p>
                    <p className=''>${dat.precio_renta} MXN</p>
                    </div>
                    <div className='w-[85%] absolute px-1 py-1 top-[54.5%] overflow-y-auto left-[6.8%] text-[0.5rem] lg:text-[0.8rem] font-semibold h-[39.5%]'>
                      <p>{dat.descripcion.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
