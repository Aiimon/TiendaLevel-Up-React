import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import Footer from "../components/Footer";
import { getProductos, agregarAlCarrito } from "../utils/apihelper";

function Ofertas({ usuario }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes amigables

  // Cargar productos en oferta
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
        setMensaje("No se pudieron cargar los productos en oferta.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Agregar producto al carrito
  const handleAgregarCarrito = async (productoId) => {
    if (!usuario?.id) {
      setMensaje("🔒 Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    const producto = productos.find((p) => p.id === productoId);
    if (!producto) {
      setMensaje("❌ Producto no encontrado.");
      return;
    }
    if (producto.stock <= 0) {
      setMensaje("⚠️ El producto está agotado.");
      return;
    }

    try {
      await agregarAlCarrito(usuario.id, productoId, 1);

      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoId ? { ...p, stock: p.stock - 1 } : p
        )
      );

      setMensaje(`✅ Se agregó "${producto.nombre}" al carrito.`);
      setTimeout(() => setMensaje(""), 3000); // Desaparece después de 3 segundos
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      setMensaje("❌ No se pudo agregar el producto al carrito.");
    }
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
          <h2 className="section-title mb-0 neon">🔥 Ofertas Gamer</h2>
          <small className="text-secondary">
            Productos con descuentos especiales por tiempo limitado
          </small>
        </div>

        {/* Mensaje visual */}
        {mensaje && (
          <div className="alert alert-info text-center">
            {mensaje}
          </div>
        )}

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
