import { useEffect, useState } from "react";
import CarritoSidebar from "../components/CarritoSidebar";
import Footer from "../components/Footer";
import { getImagenesPorTipo } from "../utils/apihelper";

function Nosotros({ carritoOpen, setCarritoOpen }) {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    getImagenesPorTipo("nosotros")
      .then((data) => setImagenes(data))
      .catch((err) => console.error("Error cargando imágenes:", err));
  }, []);

  return (
    <>
      {/* Sección Historia */}
      <section id="historia" className="hero py-5 border-bottom border-secondary-subtle">
        <div className="container">
          <h2 className="section-title mb-4">Nuestra Historia</h2>
          <p className="text-secondary lead">
            Level‑Up Gamer nació hace 2 años con la misión de brindar productos de alta calidad para gamers en todo Chile. Desde consolas y accesorios hasta PC y sillas especializadas, nuestro objetivo siempre ha sido mejorar la experiencia de juego y la satisfacción de nuestros clientes.
          </p>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="py-5">
        <div className="container">
          <h2 className="section-title mb-4">Nuestro Equipo</h2>
          <div className="row g-4">
            {imagenes.map((img) => (
              <div key={img.id} className="col-md-4">
                <div className="card team-card h-100 text-center">
                  <div className="team-card-img-container">
                    <img
                      src={img.url} // URL desde la base de datos
                      alt={img.nombre}
                      className="img-fluid"
                      onError={(e) => { e.target.src = "/img/fallback.png"; }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{img.nombre}</h5>
                    <p className="text-secondary">{img.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section id="mision-vision" className="py-5 border-bottom border-secondary-subtle">
        <div className="container">
          <h2 className="section-title mb-4">Misión, Visión y Valores</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 card-body bg-dark border border-secondary-subtle">
                <h5 className="card-title">Misión</h5>
                <p className="text-secondary">
                  Proveer productos de alta calidad y experiencias únicas para gamers, con un enfoque personalizado y atención excepcional.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-body bg-dark border border-secondary-subtle">
                <h5 className="card-title">Visión</h5>
                <p className="text-secondary">
                  Ser la tienda líder en Chile en innovación, servicio y gamificación, inspirando a la comunidad gamer a alcanzar su máximo potencial.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 card-body bg-dark border border-secondary-subtle">
                <h5 className="card-title">Valores</h5>
                <p className="text-secondary">
                  Pasión por los videojuegos, compromiso con nuestros clientes, honestidad, innovación y trabajo en equipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrito */}
      <CarritoSidebar isOpen={carritoOpen} cerrar={() => setCarritoOpen(false)} />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Nosotros;
