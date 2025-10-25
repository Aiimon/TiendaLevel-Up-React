function CarritoSidebar({ abierto, cerrar, cantidad }) {
  return (
    <div className={`carrito-sidebar ${abierto ? "open" : ""}`}>
      <div className="carrito-header d-flex justify-content-between align-items-center p-3">
        <h5>Carrito</h5>
        <button className="btn btn-light btn-sm" onClick={cerrar}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="carrito-body p-3">
        {cantidad === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <p>Tienes {cantidad} productos</p>
        )}
      </div>
    </div>
  );
}
export default CarritoSidebar;
