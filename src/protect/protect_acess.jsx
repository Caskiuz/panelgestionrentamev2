import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectAccess = ({ redirect = '/denied_acess' }) => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function get() {
      try {
        const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/`);
        setDatas(data.response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    get();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#3B5A75] flex justify-center items-center">
        <div className="flex flex-col gap-2 text-center items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white font-semibold">Verificando datos de sesión, por favor espere...</p>
        </div>
      </div>
    );
  }

  // Verificar la existencia de usuario y token en localStorage
  if (!user || !token) {
    
return <Navigate to={redirect} replace />;
  }

  // Filtrar el usuario actual
  const userVerification = datas.find(dat => dat.usuario === user);

  // Verificar si el usuario existe y tiene rol 1 (administrador)
  if (!userVerification || userVerification.rol !== 1) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
};

export default ProtectAccess;
