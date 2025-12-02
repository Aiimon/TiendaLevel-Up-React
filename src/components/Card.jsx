import { useNavigate } from "react-router-dom";

function Card({ productosDestacados }) {
  const navigate = useNavigate();

  const handleVerProducto = (id) => {
    navigate(`/detalles/${id}`);
  };

  return (
    <div className="row g-4">
      {productosDestacados.map((producto) => {
        const badge = producto.categoria?.nombre || "Destacado";

        const imgSrc = producto.imagen || "/img/fallback.png";

        return (
          <div key={producto.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-img-container">
                <img
                  src={imgSrc}
                  alt={producto.nombre}
                  className="card-img-top"
                  onError={(e) => {
                    if (!e.target.src.includes("fallback.png")) {
                      e.target.src = "/img/fallback.png";
                      console.log(
                        "Error cargando imagen, usando fallback:",
                        producto.imagen
                      );
                    }
                  }}
                />
              </div>
              <div className="card-body">
                <span className="badge badge-neon mb-2">{badge}</span>
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text text-secondary">
                  {producto.descripcion || "Sin descripción"}
                </p>
                <button
                  className="btn btn-neon-accent w-100"
                  onClick={() => handleVerProducto(producto.id)}
                >
                  <i className="bi bi-eye me-1"></i> Ver producto
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Card;
