import { Navigate } from "react-router-dom";

function ProteccionAdmin({ children, usuario }) {
  // Si no hay usuario o no es admin, redirige al home
  if (!usuario || !usuario.admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProteccionAdmin;
