import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductoCard from "../components/ProductoCard";
import BuscadorAvanzado from "../components/BuscadorAvanzado";
import Footer from "../components/Footer";
import productosD from "../data/productos.json";

// Import de imágenes
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
  "PoleraLevelUP.png": PoleraLevelUP,
};

function Categoria({ productos: productosApp, usuario, onAgregarCarrito }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoriaUrl = params.get("categoria") || "Todas";

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Inicializar productos y filtrar por categoría
  useEffect(() => {
    const iniciales = productosApp.map((p) => ({
      ...p,
      stock: localStorage.getItem(`stock_${p.id}`) !== null
        ? Number(localStorage.getItem(`stock_${p.id}`))
        : p.stock,
    }));

    setProductos(iniciales);
    setCategorias(["Todas", ...productosD.categorias]);

    const filtrados =
      categoriaUrl === "Todas"
        ? iniciales
        : iniciales.filter((p) => p.categoria === categoriaUrl);
    setProductosFiltrados(filtrados);
  }, [categoriaUrl, productosApp]);

  // Función para actualizar stock local
  const actualizarStock = (idProducto, cantidad = 1) => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.id === idProducto && p.stock >= cantidad) {
          const nuevoStock = p.stock - cantidad;
          localStorage.setItem(`stock_${p.id}`, nuevoStock);
          return { ...p, stock: nuevoStock };
        }
        return p;
      })
    );

    setProductosFiltrados((prev) =>
      prev.map((p) => {
        if (p.id === idProducto && p.stock >= cantidad) {
          const nuevoStock = p.stock - cantidad;
          return { ...p, stock: nuevoStock };
        }
        return p;
      })
    );
  };

  const handleAgregar = (producto) => {
    if (producto.stock <= 0) return;
    onAgregarCarrito(producto.id, 1); // Avanza el carrito en App.jsx
    actualizarStock(producto.id, 1);   // Reduce stock en tiempo real
  };

  return (
    <>
      <div className="container py-4">
        <BuscadorAvanzado
          categorias={categorias}
          onFilter={(filtro) => {
            const { q, cat, min, max } = filtro;
            const filtrados = productos.filter((p) => {
              const matchQ = p.nombre.toLowerCase().includes(q.toLowerCase());
              const matchCat = cat === "Todas" || p.categoria === cat;
              const matchPrecio = p.precio >= min && p.precio <= max;
              return matchQ && matchCat && matchPrecio;
            });
            setProductosFiltrados(filtrados);
          }}
        />

        <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
          <h2 className="section-title mb-0">
            {categoriaUrl === "Todas" ? "Catálogo" : categoriaUrl}
          </h2>
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
                  onAgregarCarrito={() => handleAgregar(prod)}
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

export default Categoria;
