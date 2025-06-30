import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import axios from 'axios';

export default function CollectionGalery() {
  const { _id } = useParams();
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  async function get() {
    try {
      const {data}=await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/read_especific?_id=${_id}`)
      const fotosArray = (data.response[0]?.fotos || []).map(url => ({ src: url }));
      setFotos(fotosArray);
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
      <h2 className="text-xl font-bold mb-4 text-white">Galería de equipos</h2>
      {loading ? (
        <div>Cargando imágenes...</div>
      ) : fotos.length === 0 ? (
        <div>No hay imágenes para mostrar.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {fotos.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt=""
              className="w-32 h-32 object-cover cursor-pointer rounded shadow"
              onClick={() => { setIndex(i); setOpen(true); }}
            />
          ))}
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={index}
            slides={fotos}
          />
        </div>
      )}
    </div>
  );
}
