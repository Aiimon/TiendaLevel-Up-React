import Footer from "../components/Footer";

export default function Carro({ carrito, setCarrito }) {
  // Calcular totales
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Math.min(nuevaCantidad, item.stock)) }
          : item
      )
    );
  };

  const handleEliminar = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  if (carrito.length === 0) {
    return (
      <>
        <div className="container mt-5 text-center">
          <h3>Tu carrito está vacío</h3>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4">Carrito de Compras</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map(item => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString()}</td>
                <td>
                  <input
                    type="number"
                    value={item.cantidad}
                    min={1}
                    max={item.stock}
                    onChange={e => handleCantidadChange(item.id, parseInt(e.target.value))}
                    style={{ width: 60 }}
                    className="form-control form-control-sm"
                  />
                </td>
                <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-end">
          <h5>Total ({totalProductos} productos): ${totalPrecio.toLocaleString()}</h5>
        </div>
      </div>
      <Footer />
    </>
  );
}
