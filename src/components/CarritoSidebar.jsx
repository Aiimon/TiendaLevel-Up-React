import { useNavigate } from "react-router-dom";

function CarritoSidebar({ abierto, cerrar, carrito = [], onActualizarCantidad }) {
  const navigate = useNavigate();

  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, p) => {
    const precioFinal = p.descuento
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
    return acc + p.cantidad * precioFinal;
  }, 0);

  if (!abierto) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="carrito-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1050
        }}
        onClick={cerrar}
      />

      {/* Sidebar */}
      <div
        className="carrito-sidebar open"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "350px",
          zIndex: 1051,
          backgroundColor: "#111",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.5)",
          overflowY: "auto",
          padding: "1rem",
          transition: "transform 0.3s ease",
          transform: abierto ? "translateX(0)" : "translateX(100%)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Carrito</h5>
          <button className="btn btn-light btn-sm" onClick={cerrar}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            {carrito.map(p => {
              const precioFinal = p.descuento
                ? Math.round(p.precio * (1 - p.descuento / 100))
                : p.precio;
              const stockMax = p.stock + p.cantidad;
              const srcImagen = p.imagen.startsWith("/")
                ? p.imagen
                : `/${p.imagen}`;

              return (
                <div key={p.id} className="d-flex align-items-center justify-content-between mb-3">
                  <img
                    src={srcImagen}
                    alt={p.nombre}
                    style={{ width: 50, height: 50, objectFit: "contain", marginRight: 10 }}
                  />
                  <div className="flex-grow-1">
                    <span>{p.nombre}</span>
                    <div className="d-flex align-items-center mt-1 gap-2">
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => onActualizarCantidad(p.id, p.cantidad - 1)}
                      >
                        -
                      </button>
                      <span>{p.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => onActualizarCantidad(p.id, p.cantidad + 1)}
                        disabled={p.cantidad >= stockMax}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onActualizarCantidad(p.id, 0)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <span>${(precioFinal * p.cantidad).toLocaleString()}</span>
                </div>
              );
            })}

            <hr />
            <p>Total productos: {totalProductos}</p>
            <p>Total precio: ${totalPrecio.toLocaleString()}</p>

            <button
              className="btn btn-success w-100 mt-2"
              onClick={() => navigate("/carro")}
            >
              Ver Carrito
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default CarritoSidebar;
