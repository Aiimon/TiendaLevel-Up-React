import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Especificacion from "../components/Especificacion";
import Resenia from "../components/Resenia";
import Footer from "../components/Footer";
import ReseniaForm from "../components/ReseniaForm";
import { getProductoPorId } from "../utils/apihelper";

export default function Detalles({ usuario, onAgregarCarrito }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState(0);
  const [resenias, setResenias] = useState([]);

  // Traer producto desde la API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const p = await getProductoPorId(id);
        setProducto(p);

        // Stock inicial
        const stockLS = localStorage.getItem(`stock_${p.id}`);
        setStock(stockLS !== null ? Number(stockLS) : p.stock);

        // Cargar reseñas del producto desde localStorage
        const todasResenias = JSON.parse(localStorage.getItem("resenias")) || [];
        const filtradas = todasResenias.filter(r => r.productoId === p.id);

        // Eliminar duplicados por email + fecha + productoId
        const únicas = filtradas.filter((r, index, arr) => {
          return arr.findIndex(item => item.email === r.email && item.fecha === r.fecha && item.productoId === r.productoId) === index;
        });

        setResenias(únicas);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (!producto) return <p>Producto no encontrado</p>;

  // Precio final considerando descuento y beneficio Duoc
  let precioFinal = producto.precio;
  const descuento = producto.descuento || 0;
  const tieneDescuento = descuento > 0 || usuario?.esDuoc;
  if (descuento > 0) precioFinal = Math.round(precioFinal * (1 - descuento / 100));
  if (usuario?.esDuoc) precioFinal = Math.round(precioFinal * 0.8);

  // Agregar al carrito
  const handleAgregar = () => {
    if (stock <= 0) return;
    onAgregarCarrito(producto.id, 1);
    setStock(prev => {
      const nuevoStock = Math.max(prev - 1, 0);
      localStorage.setItem(`stock_${producto.id}`, nuevoStock);
      return nuevoStock;
    });
  };

  // Agregar reseña
  const handleAgregarResenia = (resenaParcial) => {
    if (!usuario) return;

    const nuevaResena = {
      ...resenaParcial,
      productoId: producto.id,
      producto: producto.nombre,
      imagen: producto.imagen ? `/${producto.imagen.split("/").pop()}` : "/logo.png",
      fecha: new Date().toISOString(),
    };

    const todasResenias = JSON.parse(localStorage.getItem("resenias")) || [];
    todasResenias.push(nuevaResena);
    localStorage.setItem("resenias", JSON.stringify(todasResenias));

    const filtradas = todasResenias.filter(r => r.productoId === producto.id);
    const únicas = filtradas.filter((r, index, arr) => {
      return arr.findIndex(item => item.email === r.email && item.fecha === r.fecha && item.productoId === r.productoId) === index;
    });
    setResenias(únicas);
  };

  const nombreArchivo = producto.imagen ? producto.imagen.split("/").pop() : "logo.png";
  const srcImg = `/${nombreArchivo}`;

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
              {descuento > 0 && <span className="badge bg-success ms-2">-{descuento}%</span>}
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
          <ReseniaForm usuario={usuario} onAgregarReseña={handleAgregarResenia} />
          <Resenia resenias={resenias} />
        </div>
      </div>
      <Footer />
    </>
  );
}
