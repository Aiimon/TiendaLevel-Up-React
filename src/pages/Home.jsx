import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Carrito from "../components/Carrito";
import Footer from "../components/Footer";
import { getProductos } from "../utils/apihelper";

function Home({ carritoOpen, setCarritoOpen, cantidad, setCantidad, onAgregarCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const todos = await getProductos();

        // Filtrar solo productos destacados y tomar solo 3
        const destacados = todos
          .filter((p) => Boolean(p.destacado))
          .slice(0, 3);

        setProductos(destacados);
        console.log("Productos destacados:", destacados);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <>
      <Hero
        titulo="Sube de nivel tu setup"
        descripcion={
          <>
            Consolas, PC, periféricos y más. Gana{" "}
            <span className="badge badge-neon">puntos LevelUp</span> por compras y referidos.
          </>
        }
        btn1={{
          link: "/categoria",
          clase: "btn-accent",
          icon: "bi-lightning-charge",
          text: "Explorar Productos",
        }}
        btn2={{
          link: "/auth",
          clase: "btn-outline-light",
          icon: "bi-stars",
          text: "Únete",
        }}
      />

      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Productos Destacados</h2>

        {cargando ? (
          <p className="text-center">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center">No hay productos destacados disponibles.</p>
        ) : (
          <Card
            productosDestacados={productos}
            setCantidad={setCantidad}
            onAgregarCarrito={onAgregarCarrito}
          />
        )}
      </section>

      <Carrito
        open={carritoOpen}
        setOpen={setCarritoOpen}
        cantidad={cantidad}
      />

      <Footer />
    </>
  );
}

export default Home;
