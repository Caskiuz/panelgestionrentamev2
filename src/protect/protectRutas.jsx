import { Outlet } from "react-router-dom";

const ProtectRutas = ({ redirect = '/' }) => {
  const user = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');
  if (!user || !token) {
    window.location.href = `${window.location.origin}/#/`;
    return null;
  }
  return <>{/* Outlet lo maneja el router */}</>;
};

export default ProtectRutas;
