import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Carro({ carrito, usuario }) {
  const navigate = useNavigate();

  // Totales con descuentos
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, p) => {
    const precioFinal = p.descuento
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
    return acc + p.cantidad * precioFinal;
  }, 0);

  return (
    <>
      <div className="container py-4">
        <h2 className="mb-4">Resumen de tu carrito</h2>

        {carrito.length === 0 ? (
          <p className="text-center text-muted">Tu carrito está vacío</p>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="row g-3 mb-4">
              {carrito.map((p) => {
                const precioFinal = p.descuento
                  ? Math.round(p.precio * (1 - p.descuento / 100))
                  : p.precio;

                return (
                  <div key={p.id} className="col-12 d-flex align-items-center border rounded p-2">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      style={{ width: 70, height: 70, objectFit: "contain", marginRight: 10 }}
                    />
                    <div className="flex-grow-1">
                      <strong>{p.nombre}</strong>
                      {p.descuento > 0 && (
                        <div className="text-success">
                          Precio con descuento: ${precioFinal.toLocaleString()}
                        </div>
                      )}
                      <small>Cantidad: {p.cantidad}</small>
                    </div>
                    <span className="ms-3 fw-bold">${(precioFinal * p.cantidad).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <hr />
            <div className="mb-4">
              <p>Total productos: <strong>{totalProductos}</strong></p>
              <p>Total precio: <strong>${totalPrecio.toLocaleString()}</strong></p>
            </div>

            {/* Datos personales */}
            {usuario && (
              <div className="mb-4 p-3 border rounded">
                <h4>Datos personales</h4>
                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                {usuario.telefono && <p><strong>Teléfono:</strong> {usuario.telefono}</p>}
                {usuario.direccion && <p><strong>Dirección:</strong> {usuario.direccion}</p>}
              </div>
            )}

            {/* Botón para ir a Checkout */}
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={() => navigate("/checkout")}
            >
              Continuar a Checkout
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Carro;
