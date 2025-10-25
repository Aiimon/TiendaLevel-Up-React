import { Link } from "react-router-dom";

export default function ProductoCard({ producto, usuario = { esDuoc: false }, onAgregarCarrito, imagenesMap }) {
  const { id, nombre, categoria, precio, stock, rating, imagen } = producto;
  const precioFinal = usuario.esDuoc ? precio * 0.8 : precio;

  // Extraer la imagen del map
  const nombreArchivo = imagen.split("/").pop();
  const imgSrc = imagenesMap[nombreArchivo];

  return (
    <div className="card h-100 shadow-sm d-flex flex-column position-relative">

      {/* Imagen */}
      <div className="card-img-container">
        <img src={imgSrc} alt={nombre} className="card-img-top" />
      </div>

      <div className="card-body p-3 d-flex flex-column">
        {/* Nombre y categoría */}
        <h5 className="card-title">{nombre}</h5>
        <p className="text-secondary mb-2">{categoria}</p>

        {/* Precio */}
        <p className="price mb-2">
          {usuario.esDuoc ? (
            <>
              <span className="text-secondary text-decoration-line-through">
                ${precio.toLocaleString()}
              </span>{" "}
              <span className="text-danger">${precioFinal.toLocaleString()}</span>
            </>
          ) : (
            <>${precio.toLocaleString()}</>
          )}
        </p>

        {/* Stock */}
        <p className={`stock mb-2 ${stock === 0 ? "text-danger" : "text-success"}`}>
          {stock} unidad{stock !== 1 ? "es" : ""} disponible{stock !== 1 ? "s" : ""}
        </p>

        {/* Rating */}
        <div className="rating mb-3">{rating ? "★".repeat(Math.floor(rating)) : ""}</div>

        {/* Botones */}
        <div className="d-flex gap-2 mt-auto">
          <button
            className="btn btn-accent flex-grow-1"
            onClick={() => onAgregarCarrito(id, 1)}
            disabled={stock === 0}
          >
            <i className="bi bi-cart3 me-1"></i>
            {stock === 0 ? "Agotado" : "Agregar"}
          </button>

          <Link to={`/detalles/${id}`} className="btn btn-outline-light flex-grow-1">
            <i className="bi bi-eye me-1"></i> Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
