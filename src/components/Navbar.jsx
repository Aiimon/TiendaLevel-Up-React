import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar({ cantidad, abrirCarrito }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/eventos">Eventos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/soporte">Soporte</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
            </li>
          </ul>

          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-accent position-relative"
              onClick={abrirCarrito}
            >
              <i className="bi bi-cart3"></i>
              {cantidad > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  {cantidad}
                </span>
              )}
            </button>

            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i> Invitado
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/auth">
                    Ingresar / Registrar
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/perfil">
                    Perfil
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Cerrar sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
