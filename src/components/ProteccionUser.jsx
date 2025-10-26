import { useEffect, useRef } from "react";

function ProteccionUser({ children, usuario }) {
  const alertMostrada = useRef(false);

  useEffect(() => {
    if (!usuario && !alertMostrada.current) {
      alert("Debes iniciar sesión para acceder a esta sección.");
      alertMostrada.current = true;
    }
  }, [usuario]);

  if (!usuario) return <Navigate to="/auth" replace />;
  return children;
}

export default ProteccionUser;