import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductoCard from "../components/ProductoCard";
import BuscadorAvanzado from "../components/BuscadorAvanzado";
import Footer from "../components/Footer";
import { getProductos } from "../utils/apihelper"; 

function Categoria({ usuario, onAgregarCarrito }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoriaUrl = params.get("categoria") || "Todas";

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Traer productos desde API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const todos = await getProductos();

        // Inicializar stock desde localStorage si existe
        const iniciales = todos.map((p) => ({
          ...p,
          stock: localStorage.getItem(`stock_${p.id}`) !== null
            ? Number(localStorage.getItem(`stock_${p.id}`))
            : p.stock,
        }));

        setProductos(iniciales);

        // Extraer categorías únicas
        const cats = Array.from(new Set(iniciales.map((p) => p.categoria)));
        setCategorias(["Todas", ...cats]);

        // Filtrar según categoría en URL
        const filtrados =
          categoriaUrl === "Todas"
            ? iniciales
            : iniciales.filter((p) => p.categoria === categoriaUrl);
        setProductosFiltrados(filtrados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, [categoriaUrl]);

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
    onAgregarCarrito(producto.id, 1);
    actualizarStock(producto.id, 1);
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
