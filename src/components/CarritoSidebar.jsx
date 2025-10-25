function CarritoSidebar({ abierto, cerrar, carrito = [] }) {
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, p) => acc + p.cantidad * p.precio, 0);

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
            {carrito.map(p => (
              <div key={p.id} className="d-flex justify-content-between mb-2">
                <span>{p.nombre} x {p.cantidad}</span>
                <span>${(p.cantidad * p.precio).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <p>Total productos: {totalProductos}</p>
            <p>Total precio: ${totalPrecio.toLocaleString()}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CarritoSidebar;
