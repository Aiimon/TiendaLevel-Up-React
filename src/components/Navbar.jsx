import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import productosD from "../data/productos.json";

function Navbar({ cantidad, abrirCarrito, usuario }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [usuarioOpen, setUsuarioOpen] = useState(false);

  const dropdownRef = useRef(null);
  const usuarioRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProductos = () => setProductosOpen(!productosOpen);
  const toggleUsuario = () => setUsuarioOpen(!usuarioOpen);

  const categorias = productosD.categorias || [];

  // Mapear cada categoría a la imagen del primer producto
  const imagenesCategoria = {};
  categorias.forEach((cat) => {
    const prod = productosD.productos.find((p) => p.categoria === cat);
    imagenesCategoria[cat] = prod
      ? `/${prod.imagen.split("/").pop()}` // Ruta desde public
      : "/default.png"; // fallback opcional
  });

  // Cerrar dropdowns si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProductosOpen(false);
      }
      if (usuarioRef.current && !usuarioRef.current.contains(event.target)) {
        setUsuarioOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom border-secondary-subtle sticky-top"
      style={{ background: "#05050580", backdropFilter: "blur(8px)" }}
    >
      <div className="container">
        <Link className="navbar-brand brand neon active" to="/">
          <i className="bi bi-joystick me-2"></i>Level‑Up Gamer
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="nav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Dropdown de categorías */}
            <li className="nav-item position-relative" ref={dropdownRef}>
              <button
                className="nav-link btn btn-link text-decoration-none"
                onClick={toggleProductos}
                style={{ color: "white" }}
              >
                Categoría <i className="bi bi-chevron-down"></i>
              </button>

              {productosOpen && (
                <div
                  className="position-absolute bg-dark p-3 rounded shadow"
                  style={{
                    top: "100%",
                    left: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: "10px",
                    minWidth: "320px",
                    zIndex: 2000,
                    animation: "fadeInSlide 0.25s ease forwards",
                  }}
                >
                  <Link
                    to="/categoria"
                    className="dropdown-item card-mini d-flex flex-column align-items-center justify-content-center p-2 bg-dark rounded hover-neon text-center"
                    onClick={() => setProductosOpen(false)}
                  >
                    <i className="bi bi-box-seam fs-2 mb-1"></i>
                    <span style={{ fontSize: "0.85rem" }}>Ver todos</span>
                  </Link>

                  {categorias.map((cat) => (
                    <Link
                      key={cat}
                      to={`/categoria?categoria=${encodeURIComponent(cat)}`}
                      className="dropdown-item card-mini d-flex flex-column align-items-center justify-content-center p-2 bg-dark rounded hover-neon text-center"
                      onClick={() => setProductosOpen(false)}
                    >
                      {imagenesCategoria[cat] && (
                        <img
                          src={imagenesCategoria[cat]}
                          alt={cat}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            marginBottom: "5px",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <span style={{ fontSize: "0.85rem" }}>{cat}</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link neon-link" to="/ofertas">
                🔥 Ofertas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/eventos">
                Eventos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/soporte">
                Soporte
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">
                Nosotros
              </Link>
            </li>
          </ul>

          {/* Carrito y usuario */}
          <div className="d-flex gap-2 align-items-center position-relative">
            <button className="btn btn-accent position-relative" onClick={abrirCarrito}>
              <i className="bi bi-cart3"></i>
              {cantidad > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  {cantidad}
                </span>
              )}
            </button>

            <div className="position-relative" ref={usuarioRef}>
              <button
                className="btn text-white"
                onClick={toggleUsuario}
                style={{
                  border: "1px solid #fff",
                  background: "transparent",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontFamily: "'Roboto', system-ui, -apple-system, Segoe UI, sans-serif",
                }}
              >
                {usuario ? usuario : "Invitado"}
                <i className="bi bi-caret-down-fill ms-1"></i>
              </button>

              {usuarioOpen && !usuario && (
                <div
                  className="position-absolute bg-dark p-2 rounded shadow"
                  style={{
                    top: "110%",
                    right: 0,
                    minWidth: "150px",
                    zIndex: 3000,
                  }}
                >
                  <Link
                    to="/auth"
                    className="dropdown-item text-white p-2 hover-neon"
                    onClick={() => setUsuarioOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/auth"
                    className="dropdown-item text-white p-2 hover-neon"
                    onClick={() => setUsuarioOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInSlide {
          0% {opacity: 0; transform: translateY(-10px);}
          100% {opacity: 1; transform: translateY(0);}
        }
        .hover-neon:hover {
          box-shadow: 0 0 8px #1E90FF, 0 0 16px #39FF14;
          transform: translateY(-3px);
          transition: all 0.2s ease;
        }
        .dropdown-item {
          color: white !important;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
