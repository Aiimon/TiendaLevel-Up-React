import { useState, useEffect } from "react";
import ProductoCard from "../components/ProductoCard";
import BuscadorAvanzado from "../components/BuscadorAvanzado";
import productosD from "../data/productos.json";

// Importa todas las imágenes
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
  "PoleraLevelUP.png": PoleraLevelUP
};

export default function Productos({ usuario, onAgregarCarrito }) {
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const productos = productosD.productos;
    setProductosFiltrados(productos);
    setCategorias(["Todas", ...productosD.categorias]);
  }, []);

  const filtrarProductos = (filtro) => {
    const { q, cat, min, max } = filtro;
    const filtrados = productosD.productos.filter((p) => {
      const matchQ = p.nombre.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "Todas" || p.categoria === cat;
      const matchPrecio = p.precio >= min && p.precio <= max;
      return matchQ && matchCat && matchPrecio;
    });
    setProductosFiltrados(filtrados);
  };


  return (
    <div className="container py-4">
      {/* Buscador */}
      <BuscadorAvanzado categorias={categorias} onFilter={filtrarProductos} />

      {/* Encabezado general del catálogo */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h2 className="section-title mb-0">Catálogo</h2>
        <small className="text-secondary">
          Autenticidad garantizada • Origen y distribuidores detallados
        </small>
      </div>

      {/* Productos */}
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
                onAgregarCarrito={onAgregarCarrito}
                imagenesMap={imagenesMap}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
