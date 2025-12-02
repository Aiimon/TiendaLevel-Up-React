import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import Footer from "../components/Footer";
import { getProductos, agregarAlCarrito } from "../utils/apihelper";

function Ofertas({ usuario }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const allProductos = await getProductos();
        const productosConOferta = allProductos.filter(
          (p) => p.oferta === true || p.descuento > 0
        );
        setProductos(productosConOferta);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    fetchProductos();
  }, []);

  const handleAgregarCarrito = async (productoId) => {
    try {
      await agregarAlCarrito(usuario.id, productoId, 1);

      // Actualizar stock localmente para reflejar la compra
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoId ? { ...p, stock: p.stock - 1 } : p
        )
      );
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    }
  };

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
          <h2 className="section-title mb-0 neon">🔥 Ofertas Gamer</h2>
          <small className="text-secondary">
            Productos con descuentos especiales por tiempo limitado
          </small>
        </div>

        {productos.length === 0 ? (
          <div className="text-center text-danger mt-3">
            <p>No hay productos en oferta actualmente.</p>
          </div>
        ) : (
          <div className="row g-4 mt-2">
            {productos.map((prod) => (
              <div className="col-md-4" key={prod.id}>
                <ProductoCard
                  producto={prod}
                  usuario={usuario}
                  onAgregarCarrito={handleAgregarCarrito}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Ofertas;
