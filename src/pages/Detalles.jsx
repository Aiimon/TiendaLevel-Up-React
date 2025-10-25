import React, { useState, useEffect } from "react";
import ReseñaForm from "../components/ReseñaniaForm";

export default function Detalles({ producto, usuario, onAgregarCarrito }) {
  // Hooks siempre arriba
  const [stock, setStock] = useState(producto?.stock || 0);
  const [cantidad, setCantidad] = useState(1);
  const [reseñas, setReseñas] = useState([]);

  // Cargar reseñas desde localStorage (solo si hay producto)
  useEffect(() => {
    if (producto) {
      const todasReseñas = JSON.parse(localStorage.getItem("reseñas")) || {};
      setReseñas(todasReseñas[producto.id] || []);
    }
  }, [producto]);

  // Calcular precio final
  const precioFinal = usuario?.esDuoc ? producto?.precio * 0.8 : producto?.precio;

  // Si no hay producto, mostrar loader
  if (!producto) {
    return <p className="text-center text-secondary py-5">Cargando producto...</p>;
  }

  // Función para agregar reseña
  const agregarReseña = (nueva) => {
    const nuevasReseñas = [...reseñas, nueva];
    setReseñas(nuevasReseñas);

    const todasReseñas = JSON.parse(localStorage.getItem("reseñas")) || {};
    todasReseñas[producto.id] = nuevasReseñas;
    localStorage.setItem("reseñas", JSON.stringify(todasReseñas));
  };

  // Agregar al carrito
  const handleAgregarCarrito = () => {
    onAgregarCarrito(producto.id, cantidad);
    setStock((prev) => prev - cantidad);
    setCantidad(1);
  };

  const promedioRating =
    reseñas.length > 0
      ? Math.round(reseñas.reduce((acc, r) => acc + r.rating, 0) / reseñas.length)
      : 0;

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Imagen */}
        <div className="col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        {/* Detalles */}
        <div className="col-md-6">
          <h2 className="section-title">{producto.nombre}</h2>
          <p className="text-secondary">{producto.categoria}</p>

          <p className="price mb-2">
            {usuario?.esDuoc ? (
              <>
                <span className="text-secondary text-decoration-line-through">
                  ${producto.precio.toLocaleString()}
                </span>{" "}
                <span className="text-danger">${precioFinal.toLocaleString()}</span>
              </>
            ) : (
              <>${precioFinal.toLocaleString()}</>
            )}
          </p>

          <p className={stock > 0 ? "text-success" : "text-danger"}>
            {stock > 0
              ? `${stock} unidad${stock !== 1 ? "es" : ""} disponible${stock !== 1 ? "s" : ""}`
              : "Agotado"}
          </p>

          <div className="d-flex align-items-center gap-2 mb-3">
            <label className="mb-0">Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              min={1}
              max={stock}
              onChange={(e) => setCantidad(Math.min(Math.max(1, e.target.value), stock))}
              style={{ width: 60 }}
              className="form-control form-control-sm"
              disabled={stock === 0}
            />
          </div>

          <button
            className="btn btn-accent mb-3"
            onClick={handleAgregarCarrito}
            disabled={stock === 0}
          >
            <i className="bi bi-cart3 me-1"></i>
            {stock === 0 ? "Agotado" : "Agregar al carrito"}
          </button>

          {/* Especificaciones */}
          <div>
            <h5 className="orbitron">Especificaciones</h5>
            {producto.detalles && Object.keys(producto.detalles).length > 0 ? (
              <div className="table-responsive">
                <table className="table table-dark table-striped">
                  <tbody>
                    {Object.entries(producto.detalles).map(([key, val]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-secondary">No hay especificaciones disponibles.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="mt-5" style={{ maxWidth: 800, margin: "0 auto", padding: "0 15px" }}>
        <h5 className="orbitron mb-3">Reseñas de otros usuarios</h5>
        {reseñas.length === 0 ? (
          <p className="text-secondary">No hay reseñas todavía.</p>
        ) : (
          <>
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">{"★".repeat(promedioRating)}</div>
              <small className="text-secondary">
                ({reseñas.length} reseña{reseñas.length > 1 ? "s" : ""})
              </small>
            </div>

            <div className="list-group mb-3">
              {reseñas.map((r, i) => (
                <div key={i} className="list-group-item bg-dark text-light mb-2 rounded">
                  <strong>{r.nombre}</strong>{" "}
                  <small className="text-secondary">
                    {new Date(r.fecha).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </small>{" "}
                  <span className="text-warning">{"★".repeat(r.rating)}</span>
                  <p>{r.texto}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Formulario */}
        <ReseñaForm
          usuario={usuario}
          productoId={producto.id}
          onAgregarReseña={agregarReseña}
        />
      </div>
    </div>
  );
}
