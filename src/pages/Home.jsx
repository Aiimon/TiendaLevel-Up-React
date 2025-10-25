import Hero from "../components/Hero";
import Card from "../components/Card";
import Carrito from "../components/Carrito";
import Footer from "../components/Footer";
import productosD from "../data/productos.json";

import Wooting60HE from "../assets/img/Wooting60HE.png";
import AuricularesHyperXCloudII from "../assets/img/AuricularesHyperXCloudII.png";
import MouseLogitech from "../assets/img/MouseLogitech.png";

const imagenesMap = {
  "Wooting60HE.png": Wooting60HE,
  "AuricularesHyperXCloudII.png": AuricularesHyperXCloudII,
  "MouseLogitech.png": MouseLogitech,
};

const descripciones = {
  KB001: "Teclado mecánico para gaming con switches magnéticos y tecnología Rapid Trigger.",
  AC002: "Sonido envolvente 7.1, micrófono retráctil y comodidad total para horas de juego.",
  MS001: "Sensor óptico de alta precisión, iluminación RGB personalizable y diseño ergonómico."
};

function Home({ carritoOpen, setCarritoOpen, cantidad, setCantidad }) {
  const productos = productosD.productos;
  const productosDestacados = productos.filter((producto) =>
    ["Wooting60HE.png", "AuricularesHyperXCloudII.png", "MouseLogitech.png"].includes(
      producto.imagen.split("/").pop()
    )
  );

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
        btn1={{ link: "/productos", clase: "btn-accent", icon: "bi-lightning-charge", text: "Explorar Productos" }}
        btn2={{ link: "/auth", clase: "btn-outline-light", icon: "bi-stars", text: "Únete" }}
      />

      <Card
      productosDestacados={productosDestacados}
      imagenesMap={imagenesMap}
      setCantidad={setCantidad}
      descripciones={descripciones}
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
