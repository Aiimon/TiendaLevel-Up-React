import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Carrito from "../components/Carrito";
import Footer from "../components/Footer";
import { getProductos } from "../utils/apihelper";

function Home({ carritoOpen, setCarritoOpen, cantidad, setCantidad, onAgregarCarrito }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const todos = await getProductos();
        const iniciales = todos.map((p) => ({
          ...p,
          stock: localStorage.getItem(`stock_${p.id}`) !== null
            ? Number(localStorage.getItem(`stock_${p.id}`))
            : p.stock,
        }));
        setProductos(iniciales);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Filtramos los destacados según un flag en la base de datos, por ejemplo `destacado: true`
  const productosDestacados = productos.filter((producto) => producto.destacado);

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
        btn1={{ link: "/categoria", clase: "btn-accent", icon: "bi-lightning-charge", text: "Explorar Productos" }}
        btn2={{ link: "/auth", clase: "btn-outline-light", icon: "bi-stars", text: "Únete" }}
      />

      <Card
        productosDestacados={productosDestacados}
        setCantidad={setCantidad}
        onAgregarCarrito={onAgregarCarrito}
      />

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
