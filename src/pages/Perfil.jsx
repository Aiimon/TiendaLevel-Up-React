import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [boletas, setBoletas] = useState([]);
  const [resenias, setResenias] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener usuario activo
    const usuarioActivo =
      JSON.parse(localStorage.getItem("usuario")) ||
      JSON.parse(localStorage.getItem("usuarioActual"));

    if (!usuarioActivo) {
      setError("No hay una sesión activa. Inicia sesión para ver tu perfil.");
      return;
    }
    setUsuario(usuarioActivo);

    // Cargar boletas y reseñas del usuario
    const todasBoletas = JSON.parse(localStorage.getItem("boletas")) || [];
    const todasResenias = JSON.parse(localStorage.getItem("resenias")) || [];

    setBoletas(todasBoletas.filter(b => b.email === usuarioActivo.email));
    setResenias(todasResenias.filter(r => r.email === usuarioActivo.email));

    // Cargar incidencias/soportes del usuario
    const todosSoportes = JSON.parse(localStorage.getItem("mensajesSoporte")) || {};
    setIncidencias(todosSoportes[usuarioActivo.email] || []);
  }, []);

  if (error) {
    return (
      <div className="text-center py-5 text-white">
        <h4>{error}</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/login")}>
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center py-5 text-white">
        <h4>Cargando perfil...</h4>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5" style={{ color: "#fff" }}>
        {/* Datos del usuario */}
        <div className="card shadow-lg border-0 p-4 mb-4" style={{ backgroundColor: "#1e1e1e", borderRadius: "16px" }}>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3" style={{ borderColor: "#333" }}>
            <div>
              <h3 className="fw-bold mb-1">
                Bienvenido, {usuario.nombre} {usuario.apellido}
              </h3>
              <small className="text-muted" style={{ color: "#aaa" }}>
                {usuario.email}
              </small>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                localStorage.removeItem("usuario");
                navigate("/login");
              }}
            >
              Cerrar sesión
            </button>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3"><strong>RUT:</strong> <br />{usuario.rut}</div>
            <div className="col-md-6 mb-3"><strong>Teléfono:</strong> <br />{usuario.telefono}</div>
            <div className="col-md-6 mb-3"><strong>Región:</strong> <br />{usuario.region}</div>
            <div className="col-md-6 mb-3"><strong>Comuna:</strong> <br />{usuario.comuna}</div>
            <div className="col-md-6 mb-3"><strong>Fecha de nacimiento:</strong> <br />{usuario.fecha}</div>
            <div className="col-md-6 mb-3"><strong>Correo Duoc:</strong> <br />{usuario.esDuoc ? "Sí" : "No"}</div>
          </div>
        </div>

        {/* Boletas */}
        <div className="card shadow-sm border-0 p-4 mb-4" style={{ backgroundColor: "#2c2c2c", borderRadius: "16px" }}>
          <h4 className="mb-3">🧾 Mis boletas</h4>
          {boletas.length === 0 ? (
            <p className="text-muted">No tienes compras registradas.</p>
          ) : (
            <div className="list-group">
              {boletas.map((b, i) => (
                <div key={i} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: "#1e1e1e", color: "#fff", borderColor: "#333" }}>
                  <div>
                    <strong>#{b.idTransaccion}</strong> — {new Date(b.fechaCompra || b.fecha).toLocaleDateString()} <br />
                    <small>{b.productosComprados?.length || 0} productos</small>
                  </div>
                  <div><strong>${b.totalOrden?.toLocaleString()}</strong></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reseñas */}
        <div className="card shadow-sm border-0 p-4 mb-4" style={{ backgroundColor: "#2c2c2c", borderRadius: "16px" }}>
          <h4 className="mb-3">⭐ Mis reseñas</h4>
          {resenias.length === 0 ? (
            <p className="text-muted">Aún no has dejado reseñas.</p>
          ) : (
            resenias.map((r, i) => (
              <div key={i} className="border-bottom py-2" style={{ borderColor: "#333" }}>
                <strong>{r.producto}</strong>
                <p className="mb-1">{r.comentario}</p>
                <small className="text-muted">Puntaje: {r.puntaje}/5</small>
              </div>
            ))
          )}
        </div>

        {/* Incidencias */}
        <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: "#2c2c2c", borderRadius: "16px" }}>
          <h4 className="mb-3">🛠️ Mis incidencias</h4>
          {incidencias.length === 0 ? (
            <p className="text-muted">No has enviado incidencias.</p>
          ) : (
            <ul className="list-group">
              {incidencias.map((i, index) => (
                <li key={index} className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{i.tipo.toUpperCase()} - {i.asunto}</strong> – <span className="text-secondary">{i.fecha}</span>
                    <br />
                    {i.mensaje}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
