import "../App.css";

function ProductoCard({ imagen, nombre, descripcion, categoria }) {
  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm">
        <div className="card-img-container">
          <img src={imagen} alt={nombre} className="card-img-top" />
        </div>
        <div className="card-body">
          <span className="badge badge-neon mb-2">{categoria}</span>
          <h5 className="card-title">{nombre}</h5>
          <p className="card-text text-secondary">{descripcion}</p>
          <a href="/productos" className="btn btn-accent w-100">
            <i className="bi bi-cart3 me-1"></i> Comprar
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;
