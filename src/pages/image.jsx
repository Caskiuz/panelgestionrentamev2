import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Image() {
  const [fotoBase64, setFotoBase64] = useState('');
console.log(fotoBase64);
  async function get() {
    try {
      const { data } = await axios.get('https://backrecordatoriorenta-production.up.railway.app/api/admins/');
      console.log(data.response);
      if (data.response && data.response[0].foto) {
        setFotoBase64(data.response[0].foto); // Aquí asumimos que 'foto' contiene la cadena base64
      }
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  useEffect(() => {
    get();
  }, []);

  return (
    <div>
      {fotoBase64 ? (
        <img src={fotoBase64} alt="User profile" />
      ) : (
        <p>Cargando imagen...</p>
      )}
    </div>
  );
}
