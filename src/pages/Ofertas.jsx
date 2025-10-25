import { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import Footer from "../components/Footer";
import productosD from "../data/productos.json";

import RazerBlackWindowV3 from "../assets/img/razerBlackwidowV3MiniPhantom.png";
import MicrofonoBlue from "../assets/img/microfonoBlueYetiX.png";
import Dixit from "../assets/img/dixitJuegoMesa.png";
import Nintendo from "../assets/img/nintendoSwitchOLED.png";
import SillaCougar from "../assets/img/sillaCougarArmor.png";
import RazerDeathV2 from "../assets/img/razerDeathAdderV2.png";
import MousepadPower from "../assets/img/mousepadPowerplay.png";
import PcMsiTrident from "../assets/img/pcMsiTrident3.png";
import PoleraPressStart from "../assets/img/poleraPressStart.png";
import WebCamStream from "../assets/img/webcamStreamcam.png";

const imagenesMap = {
  "razerBlackwidowV3MiniPhantom.png" : RazerBlackWindowV3,
  "microfonoBlueYetiX.png" : MicrofonoBlue,
  "dixitJuegoMesa.png" : Dixit,
  "nintendoSwitchOLED.png" : Nintendo,
  "sillaCougarArmor.png" : SillaCougar,
  "razerDeathAdderV2.png" : RazerDeathV2,
  "mousepadPowerplay.png" : MousepadPower,
  "pcMsiTrident3.png" : PcMsiTrident,
  "poleraPressStart.png" : PoleraPressStart,
  "webcamStreamcam.png" : WebCamStream,
};

function Ofertas({ usuario, onAgregarCarrito }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Filtrar solo los productos en oferta
    const productosConOfertas = productosD.productos
      .map((p) => ({
        ...p,
        stock: Number(localStorage.getItem(`stock_${p.id}`)) || p.stock,
      }))
      .filter((p) => p.oferta === true || p.descuento > 0);

    setProductos(productosConOfertas);
  }, []);

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
                    onAgregarCarrito(prod);
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
