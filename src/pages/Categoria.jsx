import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // <- IMPORT
import ProductoCard from "../components/ProductoCard";
import BuscadorAvanzado from "../components/BuscadorAvanzado";
import Footer from "../components/Footer";
import productosD from "../data/productos.json";

import Wooting60HE from "../assets/img/Wooting60HE.png";
import AuricularesHyperXCloudII from "../assets/img/AuricularesHyperXCloudII.png";
import MouseLogitech from "../assets/img/MouseLogitech.png";
import Catan from "../assets/img/catanJuegoMesa.png";
import Carcassonne from "../assets/img/carcassonneJuegoMesa.png";
import AccesorioMandoXbox from "../assets/img/accesorioMandoXbox.png";
import PlayStation5 from "../assets/img/playStation5.png";
import PcAsusROG from "../assets/img/PcAsusROG.png";
import SillaSecretlab from "../assets/img/sillaSecretlab.png";
import MousepadRazer from "../assets/img/MousepadRazer.png";
import PoleraLevelUP from "../assets/img/PoleraLevelUP.png";
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
  "Wooting60HE.png": Wooting60HE,
  "AuricularesHyperXCloudII.png": AuricularesHyperXCloudII,
  "MouseLogitech.png": MouseLogitech,
  "catanJuegoMesa.png": Catan,
  "carcassonneJuegoMesa.png": Carcassonne,
  "accesorioMandoXbox.png": AccesorioMandoXbox,
  "playStation5.png": PlayStation5,
  "PcAsusROG.png": PcAsusROG,
  "sillaSecretlab.png": SillaSecretlab,
  "MousepadRazer.png": MousepadRazer,
  "PoleraLevelUP.png": PoleraLevelUP,
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

function Productos({ usuario, onAgregarCarrito }) {
  const location = useLocation(); // <- LEEMOS LA URL
  const params = new URLSearchParams(location.search);
  const categoriaUrl = params.get("categoria") || "Todas";

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const iniciales = productosD.productos.map((p) => ({
      ...p,
      stock: Number(localStorage.getItem(`stock_${p.id}`)) || p.stock,
    }));
    setProductos(iniciales);
    setCategorias(["Todas", ...productosD.categorias]);

    // Filtrar por categoría de URL al cargar
    const filtrados = categoriaUrl === "Todas"
      ? iniciales
      : iniciales.filter(p => p.categoria === categoriaUrl);
    setProductosFiltrados(filtrados);
  }, [categoriaUrl]);

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

  const filtrarProductos = (filtro) => {
    const { q, cat, min, max } = filtro;
    const filtrados = productos.filter((p) => {
      const matchQ = p.nombre.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "Todas" || p.categoria === cat;
      const matchPrecio = p.precio >= min && p.precio <= max;
      return matchQ && matchCat && matchPrecio;
    });
    setProductosFiltrados(filtrados);
  };

  return (
    <>
    <div className="container py-4">
      <BuscadorAvanzado categorias={categorias} onFilter={filtrarProductos} />

      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h2 className="section-title mb-0">{categoriaUrl === "Todas" ? "Catálogo" : categoriaUrl}</h2>
        <small className="text-secondary">
          Autenticidad garantizada • Origen y distribuidores detallados
        </small>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="text-center text-danger mt-3">
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <div className="row g-4 mt-2">
          {productosFiltrados.map((prod) => (
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

export default Productos;
