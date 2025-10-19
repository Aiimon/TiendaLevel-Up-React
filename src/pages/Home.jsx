import Footer from "../components/Footer";
import ProductoCard from "../components/ProductoCard";
import productosD from "../data/productos.json";
import "../App.css";

import Wooting60HE from "../assets/img/Wooting60HE.png";
import AuricularesHyperXCloudII from "../assets/img/AuricularesHyperXCloudII.png";
import MouseLogitech from "../assets/img/MouseLogitech.png";

const imagenesMap = {
  "Wooting60HE.png": Wooting60HE,
  "AuricularesHyperXCloudII.png": AuricularesHyperXCloudII,
  "MouseLogitech.png": MouseLogitech,
};

function Home() {
  const productos = productosD.productos;

  // Solo los productos destacados que quieres mostrar
  const productosDestacados = productos.filter((producto) =>
    ["Wooting60HE.png", "AuricularesHyperXCloudII.png", "MouseLogitech.png"].includes(
      producto.imagen.split("/").pop()
    )
  );

  return (
    <>
      {/* Header */}
      <header id="home" className="hero py-5 border-bottom border-secondary-subtle">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 section-title">Sube de nivel tu setup</h1>
              <p className="lead text-secondary">
                Consolas, PC, periféricos y más. Gana{" "}
                <span className="badge badge-neon">puntos LevelUp</span> por compras y referidos.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <a href="/productos" className="btn btn-accent">
                  <i className="bi bi-lightning-charge me-1"></i> Explorar Productos
                </a>
                <a href="/auth" className="btn btn-outline-light">
                  <i className="bi bi-stars me-1"></i> Únete
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Productos Destacados */}
      <section id="productos-destacados" className="py-5">
        <div className="container">
          <h2 className="section-title mb-4">Productos Destacados</h2>
          <div className="row g-4">
            {productosDestacados.map((producto) => {
              // Asignar badge según producto
              let badge = "";
              switch (producto.imagen.split("/").pop()) {
                case "Wooting60HE.png":
                  badge = "Top";
                  break;
                case "AuricularesHyperXCloudII.png":
                  badge = "Nuevo";
                  break;
                case "MouseLogitech.png":
                  badge = "Más vendido";
                  break;
                default:
                  badge = producto.categoria;
              }

              return (
                <ProductoCard
                  key={producto.id}
                  imagen={imagenesMap[producto.imagen.split("/").pop()]}
                  nombre={producto.nombre}
                  descripcion={producto.descripcion}
                  categoria={producto.categoria}
                />
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
