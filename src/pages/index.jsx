import React, { useState } from 'react';
import background from '../images/background_index.jpg';

export default function Index() {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState(null);

  async function login(e) {
    e.preventDefault();
    setError(null);
    // Aquí solo mostramos los datos, no hacemos petición
    if (!usuario || !contraseña) {
      setError('Usuario y contraseña requeridos');
      return;
    }
    alert(`Usuario: ${usuario}\nContraseña: ${contraseña}`);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, background: '#fff8', padding: 8, borderRadius: 4, fontSize: 12, zIndex: 10 }}>
        <div><b>Ruta importada:</b> {String(background)}</div>
        <img src={background} alt="test-bg" style={{ maxWidth: 120, maxHeight: 60, marginTop: 4, border: '1px solid #ccc' }} />
      </div>
      <form onSubmit={login} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002', minWidth: 320, zIndex: 2 }}>
        <h2 style={{ marginBottom: 24 }}>Login ultra básico</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Usuario</label>
          <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Contraseña</label>
          <input type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}