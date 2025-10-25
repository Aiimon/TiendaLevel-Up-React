import React from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Checkout({ carrito, onActualizarCantidad }) {
  const navigate = useNavigate();

  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, p) => {
    const precioFinal = p.descuento
      ? Math.round(p.precio * (1 - p.descuento / 100))
      : p.precio;
    return acc + p.cantidad * precioFinal;
  }, 0);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Checkout</h2>

      {carrito.length === 0 ? (
        <p className="text-center text-muted">Tu carrito está vacío</p>
      ) : (
        <div className="row g-4">
          {/* Lista de productos */}
          <div className="col-lg-8">
            {carrito.map((p) => {
              const precioFinal = p.descuento
                ? Math.round(p.precio * (1 - p.descuento / 100))
                : p.precio;

              return (
                <div
                  key={p.id}
                  className="card mb-3 shadow-sm d-flex flex-row align-items-center p-2"
                >
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "contain",
                      marginRight: 15,
                    }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{p.nombre}</h5>
                    {p.descuento > 0 && (
                      <span className="badge bg-danger mb-1">
                        -{p.descuento}%
                      </span>
                    )}
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          onActualizarCantidad(p.id, p.cantidad - 1)
                        }
                        disabled={p.cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{p.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          onActualizarCantidad(p.id, p.cantidad + 1)
                        }
                        disabled={p.cantidad >= p.stock + p.cantidad}
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
                  <div className="fw-bold">
                    ${ (precioFinal * p.cantidad).toLocaleString() }
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen y pago */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-3">
              <h4 className="mb-3">Resumen del pedido</h4>
              <p>Total productos: <strong>{totalProductos}</strong></p>
              <p>Total a pagar: <strong>${totalPrecio.toLocaleString()}</strong></p>

              <PayPalScriptProvider
                options={{
                  "client-id":
                    "AdPk7nylxq-_Cjepu-zLtkRcs6MXPi9RkPJ6MOJKGA-5hF9IHIy-WCsEc5y0NHnSXUb5H_bsZMkIWauw",
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "paypal",
                  }}
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
                    alert(
                      "Pago simulado exitoso! ID de transacción: " + order.id
                    );
                    navigate("/");
                  }}
                />
              </PayPalScriptProvider>

              <button
                className="btn btn-secondary w-100 mt-3"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
