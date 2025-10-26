import { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import Footer from "../components/Footer";

const imagenesMap = {
  "razerBlackwidowV3MiniPhantom.png": "/img/razerBlackwidowV3MiniPhantom.png",
  "microfonoBlueYetiX.png": "/img/microfonoBlueYetiX.png",
  "dixitJuegoMesa.png": "/img/dixitJuegoMesa.png",
  "nintendoSwitchOLED.png": "/img/nintendoSwitchOLED.png",
  "sillaCougarArmor.png": "/img/sillaCougarArmor.png",
  "razerDeathAdderV2.png": "/img/razerDeathAdderV2.png",
  "mousepadPowerplay.png": "/img/mousepadPowerplay.png",
  "pcMsiTrident3.png": "/img/pcMsiTrident3.png",
  "poleraPressStart.png": "/img/poleraPressStart.png",
  "webcamStreamcam.png": "/img/webcamStreamcam.png",
};


function Ofertas({ productos: productosApp, usuario, onAgregarCarrito }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosConOfertas = productosApp
      .filter((p) => p.oferta === true || p.descuento > 0)
      .map((p) => {
        const stockLS = localStorage.getItem(`stock_${p.id}`);
        return {
          ...p,
          stock: stockLS !== null ? Number(stockLS) : p.stock,
        };
      });
    setProductos(productosConOfertas);
  }, [productosApp]);

  const actualizarStock = (idProducto) => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.id === idProducto && p.stock > 0) {
          const nuevoStock = p.stock - 1;
          localStorage.setItem(`stock_${p.id}`, nuevoStock);
          return { ...p, stock: nuevoStock };
        }
        return p;
      })
    );
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
                  imagenesMap={imagenesMap}
                  onAgregarCarrito={() => {
                    if (prod.stock <= 0) return;
                    onAgregarCarrito(prod.id, 1);
                    actualizarStock(prod.id);
                  }}
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
