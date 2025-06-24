import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectLogin = ({ redirect = '/' }) => {
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
        console.error('Error fetching image data:', error);
      } finally {
        setIsLoading(false); // Termina la carga independientemente del resultado
      }
    }
    get();
  }, []);

  if (isLoading) {
    return <div className="w-full h-screen bg-[#3B5A75] flex justify-center items-center">
       <div className="flex flex-col gap-2 text-center items-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p className="text-white font-semibold">Verificando datos de sesión, por favor espere...</p>
       </div>
    </div>; // O un spinner o cualquier indicador de carga
  }

  const user_verification = datas.filter(dat => dat.usuario === user);

  if (user_verification.length === 0) {
    localStorage.clear();
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
};

export default ProtectLogin;
