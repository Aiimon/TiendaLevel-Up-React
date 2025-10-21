function Cards({ productosDestacados, imagenesMap, setCantidad, descripciones }) {
  const handleComprar = () => {
    setCantidad(prev => prev + 1);
  };

  return (
    <section id="productos-destacados" className="py-5">
      <div className="container">
        <h2 className="section-title mb-4">Productos Destacados</h2>
        <div className="row g-4">
          {productosDestacados.map((producto) => {
            let badge = "";
            switch (producto.imagen.split("/").pop()) {
              case "Wooting60HE.png":
                badge = "Top"; break;
              case "AuricularesHyperXCloudII.png":
                badge = "Nuevo"; break;
              case "MouseLogitech.png":
                badge = "Más vendido"; break;
              default:
                badge = producto.categoria;
            }

            return (
              <div key={producto.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-img-container">
                    <img
                      src={imagenesMap[producto.imagen.split("/").pop()]}
                      alt={producto.nombre}
                    />
                  </div>
                  <div className="card-body">
                    <span className="badge badge-neon mb-2">{badge}</span>
                    <h5 className="card-title">{producto.nombre}</h5>
                    {/* Aquí se toma la descripción personalizada si existe */}
                    <p className="card-text text-secondary">
                      {descripciones[producto.id] || producto.descripcion}
                    </p>
                    <button
                      className="btn btn-accent w-100"
                      onClick={handleComprar}
                    >
                      <i className="bi bi-cart3 me-1"></i> Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Cards;
