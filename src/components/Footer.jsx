import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-5 border-top border-secondary-subtle"
      style={{ background: "var(--bg)", color: "var(--text-2)" }}
    >
      <div className="container d-flex flex-wrap justify-content-between align-items-start gap-4">

        {/* Logo / Nombre */}
        <div className="d-flex flex-column">
          <h5 className="brand neon mb-2">
            <i className="bi bi-joystick me-2"></i>Level‑Up Gamer
          </h5>
          <span className="text-secondary small">Tu tienda gamer de confianza en Chile</span>
        </div>

        {/* Newsletter */}
        <div className="d-flex flex-column">
          <h6 className="mb-2">Suscríbete</h6>
          <p className="text-secondary small mb-2">Recibe novedades y ofertas exclusivas</p>
          <form className="d-flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="form-control dark-input"
              style={{ minWidth: "200px" }}
            />
            <button type="submit" className="btn btn-accent">Enviar</button>
          </form>
        </div>

        {/* Redes sociales */}
        <div className="d-flex flex-column">
          <h6 className="mb-2">Síguenos</h6>
          <div className="d-flex gap-2">
            <a href="https://www.facebook.com/?locale=es_LA" className="text-light fs-5"><i className="bi bi-facebook"></i></a>
            <a href="https://x.com" className="text-light fs-5"><i className="bi bi-twitter"></i></a>
            <a href="https://www.instagram.com" className="text-light fs-5"><i className="bi bi-instagram"></i></a>
            <a href="https://www.youtube.com" className="text-light fs-5"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* Enlaces legales */}
      <div className="container mt-3 d-flex flex-wrap justify-content-between align-items-center gap-3 border-top border-secondary-subtle pt-3">
        <span className="text-secondary small">© {year} Level‑Up Gamer. Todos los derechos reservados.</span>
        <div className="d-flex gap-3">
          <Link to="/terminos" className="text-light text-decoration-none small">Términos y Condiciones</Link>
          <Link to="/privacidad" className="text-light text-decoration-none small">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
