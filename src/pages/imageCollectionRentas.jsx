import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import axios from 'axios';

export default function ImageCollectionRentas() {
  const { _id } = useParams();
  const [fotosInicial, setFotosInicial] = useState([]);
  const [fotosDevolucion, setFotosDevolucion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeGallery, setActiveGallery] = useState('inicial');

  async function get() {
    try {
      const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/rentas/read_especific?_id=${_id}`);
      const fotosArray = (data.response[0]?.fotos_estado_inicial || []).map(url => ({ src: url }));
      const fotosArray2 = (data.response[0]?.fotos_estado_devolucion || []).map(url => ({ src: url }));
      setFotosInicial(fotosArray);
      setFotosDevolucion(fotosArray2);
      setLoading(false);
      return data.response;
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    get();
  }, [_id]);

  return (
    <div className='w-full min-h-screen bg-[#303446de]' style={{ padding: 24 }}>
      <h2 className="text-xl font-bold mb-4 text-white">Galería de Rentas</h2>
      {loading ? (
        <div className="text-white">Cargando imágenes...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-200 mb-2">Evidencia RM (como se entregan los equipos al cliente)</h3>
            {fotosInicial.length === 0 ? (
              <div className="text-gray-300">No hay imágenes de entrega.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {fotosInicial.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt=""
                    className="w-32 h-32 object-cover cursor-pointer rounded shadow"
                    onClick={() => { setIndex(i); setActiveGallery('inicial'); setOpen(true); }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-200 mb-2">Evidencia de devolución (como el cliente regresó los equipos)</h3>
            {fotosDevolucion.length === 0 ? (
              <div className="text-gray-300">No hay imágenes de devolución.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {fotosDevolucion.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt=""
                    className="w-32 h-32 object-cover cursor-pointer rounded shadow"
                    onClick={() => { setIndex(i); setActiveGallery('devolucion'); setOpen(true); }}
                  />
                ))}
              </div>
            )}
          </div>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={index}
            slides={activeGallery === 'inicial' ? fotosInicial : fotosDevolucion}
          />
        </div>
      )}
    </div>
  );
}
