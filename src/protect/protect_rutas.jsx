import { Navigate, Outlet } from "react-router-dom";

const ProtectRutas = ({ redirect = '/' }) => {
 const user = localStorage.getItem('usuario');
 const token= localStorage.getItem('token')
 if (!user && !token) {
    return <Navigate to={redirect} replace />;
  }
 return <Outlet />;
}
export default ProtectRutas;