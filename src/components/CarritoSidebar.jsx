import { useNavigate } from "react-router-dom";

function CarritoSidebar({ abierto, cerrar, carrito = [], onActualizarCantidad }) {
  const navigate = useNavigate(); // Hook para navegar

  // Total de productos y precio considerando descuentos
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, p) => {
    const precioFinal = p.descuento
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
    return acc + p.cantidad * precioFinal;
  }, 0);

  return (
    <div className={`carrito-sidebar ${abierto ? "open" : ""}`}>
      <div className="carrito-header d-flex justify-content-between align-items-center p-3">
        <h5>Carrito</h5>
        <button className="btn btn-light btn-sm" onClick={cerrar}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="carrito-body p-3">
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            {carrito.map(p => {
              const precioFinal = p.descuento
                ? Math.round(p.precio * (1 - p.descuento / 100))
                : p.precio;

              const stockMax = p.stock + p.cantidad;

              return (
                <div key={p.id} className="d-flex align-items-center justify-content-between mb-3">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{ width: 50, height: 50, objectFit: "contain", marginRight: 10 }}
                  />

                  <div className="flex-grow-1">
                    <span>{p.nombre}</span>
                    <div className="d-flex align-items-center mt-1 gap-2">
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => onActualizarCantidad(p.id, p.cantidad - 1)}
                        disabled={p.cantidad <= 1}
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

            {/* Botón comprar / pagar */}
            <button
              className="btn btn-success w-100 mt-2"
              onClick={() => navigate("/carro")} // Redirige a la página carro
            >
              Ver Carrito
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CarritoSidebar;
