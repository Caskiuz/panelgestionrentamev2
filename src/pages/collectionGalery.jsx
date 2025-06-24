import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Gallery from 'react-photo-gallery';
import axios from 'axios';

export default function CollectionGalery() {
  const { _id } = useParams();
  const [fotos, setFotos] = useState([]);
  console.log(fotos);
  const [loading, setLoading] = useState(true);

async function get() {
    try {
        const {data}=await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/notas_remision/read_especific?_id=${_id}`)
    // data.response[0].fotos debe ser un array de URLs
    const fotosArray = (data.response[0]?.fotos || []).map(url => ({
      src: url,
      width: 4,   // Puedes ajustar el aspect ratio según tus imágenes
      height: 3,
    }));
    setFotos(fotosArray);
    setLoading(false);

        return data.response
    } catch (error) {
        setLoading(false);
    }
}

  useEffect(() => {
 get()
  }, [_id]);

  return (
    <div className='w-full min-h-screen bg-[#303446de]' style={{ padding: 24 }}>
      <h2 className="text-xl font-bold mb-4 text-white">Galería de equipos</h2>
      {loading ? (
        <div>Cargando imágenes...</div>
      ) : fotos.length === 0 ? (
        <div>No hay imágenes para mostrar.</div>
      ) : (
        <Gallery photos={fotos} direction="row" />
      )}
    </div>
  );
}
