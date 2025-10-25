import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Especificacion from "../components/Especificacion";
import Resenia from "../components/Resenia";
import Footer from "../components/Footer";
import ReseniaForm from "../components/ReseniaForm";

export default function Detalles({ productos, usuario, onAgregarCarrito }) {
  const { id } = useParams();
  const producto = productos.find(p => p.id === id);

  const [resenias, setResenias] = useState([
    { nombre: "Juan", texto: "Excelente producto", rating: 5, fecha: new Date() }
  ]);

  // Inicializamos el stock desde localStorage
  const [stock, setStock] = useState(() => {
    const stockLS = localStorage.getItem(`stock_${producto?.id}`);
    return stockLS !== null ? Number(stockLS) : producto?.stock || 0;
  });

  // Cada vez que cambia el producto, actualizar el stock desde localStorage
  useEffect(() => {
    if (producto) {
      const stockLS = localStorage.getItem(`stock_${producto.id}`);
      setStock(stockLS !== null ? Number(stockLS) : producto.stock);
    }
  }, [producto]);

  if (!producto) return <p>Producto no encontrado</p>;

  // Calcular descuento
  const descuento = producto.descuento || 0;
  const tieneDescuento = descuento > 0 || (usuario && usuario.esDuoc);

  let precioFinal = producto.precio;
  if (descuento > 0) precioFinal = Math.round(precioFinal * (1 - descuento / 100));
  if (usuario?.esDuoc) precioFinal = Math.round(precioFinal * 0.8);

  // Manejar agregar al carrito y actualizar stock localStorage
  const handleAgregar = () => {
    if (stock <= 0) return;

    onAgregarCarrito(producto.id, 1);

    setStock(prev => {
      const nuevoStock = Math.max(prev - 1, 0);
      localStorage.setItem(`stock_${producto.id}`, nuevoStock);
      return nuevoStock;
    });
  };

  const handleAgregarResenia = (resenia) => {
    setResenias(prev => [...prev, { ...resenia, fecha: new Date() }]);
  };

  // Importar imágenes dinámicamente
  const imagenes = import.meta.glob('../assets/img/*', { eager: true, as: 'url' });
  const nombreArchivo = producto.imagen.split("/").pop();
  const srcImg = imagenes[`../assets/img/${nombreArchivo}`];

  return (
    <>
      <div className="container mt-4">
        <div className="row align-items-start">
          <div className="col-md-5 text-center mb-3">
            <img
              src={srcImg}
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: 400, objectFit: "contain" }}
            />
          </div>
          <div className="col-md-7">
            <h2 className="mb-1">{producto.nombre}</h2>
            <p className="text-secondary mb-2">{producto.categoria}</p>
            <p>{producto.descripcion}</p>

            <Especificacion detalles={producto.detalles} />

            <p className="price mb-3">
              {descuento > 0 && (
                <span className="text-secondary text-decoration-line-through me-2">
                  ${producto.precio.toLocaleString()}
                </span>
              )}
              <span className={tieneDescuento ? "text-danger" : "text-success"}>
                ${precioFinal.toLocaleString()}
              </span>
              {descuento > 0 && (
                <span className="badge bg-success ms-2">
                  -{descuento}%
                </span>
              )}
            </p>

            <p className={stock > 0 ? "text-success" : "text-danger"}>
              {stock > 0
                ? `${stock} unidad${stock !== 1 ? "es" : ""} disponible${stock !== 1 ? "s" : ""}`
                : "Agotado"}
            </p>

            <button
              className="btn btn-accent w-100"
              onClick={handleAgregar}
              disabled={stock === 0}
            >
              Agregar al carrito
            </button>
          </div>
        </div>

        <div className="mt-5">
          <ReseniaForm onAgregarResenia={handleAgregarResenia} />
          <Resenia resenias={resenias} />
        </div>
      </div>
      <Footer />
    </>
  );
}
