import React from "react";
import { useNavigate } from "react-router-dom";

function Boleta() {
  const navigate = useNavigate();
  const ultimaBoleta = JSON.parse(localStorage.getItem("ultimaBoleta") || "null");

  if (!ultimaBoleta) {
    return (
      <div className="container py-5">
        <h2>Boleta</h2>
        <p>No hay una compra reciente.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Ir al inicio</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Boleta - LevelUp</h3>
            <small className="text-muted">Fecha: {new Date(ultimaBoleta.fecha).toLocaleString()}</small>
          </div>
          <div className="text-end">
            <strong>Transacción</strong>
            <div className="small text-muted">{ultimaBoleta.idTransaccionPayPal}</div>
          </div>
        </div>

        <div>
          {ultimaBoleta.items.map(item => (
            <div key={item.id} className="d-flex align-items-center py-2 border-bottom">
              <img src={item.imagen} alt={item.nombre} style={{ width: 70, height: 70, objectFit: "contain", marginRight: 15 }} />
              <div className="flex-grow-1">
                <div className="fw-bold">{item.nombre}</div>
                <div className="text-muted">Cantidad: {item.cantidad} × ${item.precioUnitario.toLocaleString()}</div>
              </div>
              <div className="fw-bold">${item.subtotal.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <div style={{ width: 300 }}>
            <div className="d-flex justify-content-between">
              <span>Productos</span><strong>{ultimaBoleta.totalProductos}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Total</span><strong>${ultimaBoleta.totalPrecio.toLocaleString()}</strong>
            </div>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={() => {
                navigate("/");
              }}
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boleta;
