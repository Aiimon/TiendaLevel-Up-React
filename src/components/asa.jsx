import ProductCard from "./ProductoCard";

export default function Catalogo({ productos = [], onAgregarCarrito }) {
  if (!productos || productos.length === 0) {
    return <p className="text-center text-danger">No se encontraron productos.</p>;
  }

  return (
    <section id="catalogo" className="py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title mb-0">Catálogo</h2>
          <small className="text-secondary">
            Autenticidad garantizada • Origen y distribuidores detallados
          </small>
        </div>
        <div className="row g-4">
          {productos.map(p => (
            <div key={p.id} className="col-md-4">
              <ProductCard producto={p} onAgregarCarrito={onAgregarCarrito} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
