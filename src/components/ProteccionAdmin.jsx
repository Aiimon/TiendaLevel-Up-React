function ProteccionAdmin({ children, usuario }) {
  if (!usuario || usuario.rol !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProteccionAdmin;