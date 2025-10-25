import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productosJson from "../data/productos.json";
import Especificacion from "../components/Especificacion";
import AgregarCarrito from "../components/AgregarCarrito";
import Resenia from "../components/Resenia";
import Footer from "../components/Footer";
import ReseniaForm from "../components/ReseniaForm";

export default function Detalles({ usuario }) {
  const { id } = useParams();
  const producto = productosJson.productos.find(p => p.id === id);

  const [resenias, setResenias] = useState([
    { nombre: "Juan", texto: "Excelente producto", rating: 5, fecha: new Date() }
  ]);

  useEffect(() => {
    if (producto) {
      document.title = `Level-Up · ${producto.nombre}`;
    } else {
      document.title = "Level-Up · Producto";
    }
  }, [producto]);

  const handleAgregar = (cantidad) => {
    console.log(`Agregaste ${cantidad} unidades de ${producto.nombre}`);
  };

  const handleAgregarResenia = (resenia) => {
    setResenias(prev => [...prev, { ...resenia, fecha: new Date() }]);
  };

  if (!producto) return <p>Producto no encontrado</p>;

  const imagenes = import.meta.glob('../assets/img/*', { eager: true, as: 'url' });
  const srcImg = imagenes[`../assets/${producto.imagen}`];

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


          <AgregarCarrito
            stockInicial={producto.stock}
            precio={producto.precio}
            onAgregar={handleAgregar}
            usuario={usuario}
          />
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
