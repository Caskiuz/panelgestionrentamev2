import axios from "axios";
import { useEffect, useState } from "react";

const ProtectAccess = ({ redirect = '/denied_acess' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      setIsLoading(false);
      setIsAdmin(false);
      return;
    }
    async function validateAdmin() {
      try {
        const { data } = await axios.get(`https://backrecordatoriorenta-production.up.railway.app/api/admins/`);
        const userData = data.response.find(dat => dat.usuario === user);
        if (userData && userData.rol === 1) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }
    validateAdmin();
  }, [user, token]);

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

  if (!user || !token || !isAdmin) {
    window.location.href = `${window.location.origin}/#/denied_acess`;
    return null;
  }

  return <>{/* Outlet lo maneja el router */}</>;
};

export default ProtectAccess;
