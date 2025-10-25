import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Footer from "../components/Footer";

function Carro({ carrito, onActualizarCantidad }) {
  const navigate = useNavigate();

  // Calcular totales considerando descuentos
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
          <div className="row g-3">
            {carrito.map((p) => {
              const precioFinal = p.descuento
                ? Math.round(p.precio * (1 - p.descuento / 100))
                : p.precio;

              const stockMax = p.stock + p.cantidad;

              return (
                <div key={p.id} className="col-12 d-flex align-items-center border rounded p-2">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{ width: 70, height: 70, objectFit: "contain", marginRight: 10 }}
                  />
                  <div className="flex-grow-1">
                    <strong>{p.nombre}</strong>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onActualizarCantidad(p.id, p.cantidad - 1)}
                        disabled={p.cantidad <= 1}
                      >
                        -
                      </button>
                      <span>{p.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
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
                    {p.descuento > 0 && (
                      <small className="text-success">
                        Precio con descuento aplicado: ${precioFinal.toLocaleString()}
                      </small>
                    )}
                  </div>
                  <span className="ms-3 fw-bold">${(precioFinal * p.cantidad).toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <hr />
          <div className="d-flex justify-content-between mb-3">
            <span>Total productos: {totalProductos}</span>
            <span className="fw-bold">Total precio: ${totalPrecio.toLocaleString()}</span>
          </div>

          {/* Botón continuar a checkout */}
          <button
            className="btn btn-primary w-100 mb-3"
            onClick={() => navigate("/checkout")}
          >
            Continuar a Checkout
          </button>

          {/* PayPal Sandbox US */}
          <PayPalScriptProvider options={{ "client-id": "AdPk7nylxq-_Cjepu-zLtkRcs6MXPi9RkPJ6MOJKGA-5hF9IHIy-WCsEc5y0NHnSXUb5H_bsZMkIWauw", currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "blue", label: "pay" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalPrecio.toString(),
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const order = await actions.order.capture();
                alert(`Pago exitoso! ID de transacción: ${order.id}`);
                // Aquí podrías limpiar el carrito
              }}
            />
          </PayPalScriptProvider>

          <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
            Volver
          </button>
        </>
      )}
    </div>
    <Footer />
    </>
  );
}

export default Carro;
