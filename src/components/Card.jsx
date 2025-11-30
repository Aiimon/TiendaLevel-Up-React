import { useNavigate } from "react-router-dom";

function Card({ productosDestacados, descripciones }) {
  const navigate = useNavigate();

  const handleVerProducto = (id) => {
    navigate(`/detalles/${id}`);
  };

  return (
    <section id="productos-destacados" className="py-5">
      <div className="container">
        <h2 className="section-title mb-4">Productos Destacados</h2>
        <div className="row g-4">
          {productosDestacados.map((producto) => {
            let badge = "";

            if (producto.nombre.includes("Wooting")) badge = "Top";
            else if (producto.nombre.includes("HyperX")) badge = "Nuevo";
            else if (producto.nombre.includes("Logitech")) badge = "Más vendido";
            else badge = producto.categoria || "Destacado";

            return (
              <div key={producto.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-img-container">
                    <img
                      src={producto.imagen || "/img/default.png"}
                      alt={producto.nombre}
                    />
                  </div>
                  <div className="card-body">
                    <span className="badge badge-neon mb-2">{badge}</span>
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text text-secondary">
                      {descripciones?.[producto.id] || producto.descripcion || "Sin descripción"}
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
      </div>
    </section>
  );
}

export default Card;
