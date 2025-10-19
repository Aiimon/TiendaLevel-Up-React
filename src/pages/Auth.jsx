import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import logo from "../assets/img/logo.png";

function Auth() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registro enviado");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Inicio de sesión enviado");
  };

  return (
    <section className="banner-auth">
      <div className="banner-left d-flex flex-column justify-content-center align-items-center text-center">
        <img src={logo} alt="Logo Level-Up Gamer" className="mb-4" style={{ maxWidth: "500px" }} />
        <h1 className="neon">Sube de nivel tu setup</h1>
        <p>
          Consolas, PC, periféricos y más.<br />
          Gana puntos LevelUp por compras y referidos.<br /><br />
          <span className="duoc-msg">
            Usuarios <strong>@duoc.cl</strong> obtienen{" "}
            <span className="accent">20% de descuento de por vida</span>.
          </span>
        </p>
      </div>

      <div className="banner-right">
        <div className="auth-box dark-card">
          <h2 className="mb-4">
            <i className="bi bi-person-circle me-2"></i>Bienvenido
          </h2>
          <button
            className="btn btn-accent w-100 mb-3"
            onClick={() => setShowRegister(true)}
          >
            <i className="bi bi-person-plus-fill me-2"></i>Crear cuenta
          </button>
          <button
            className="btn btn-outline-light w-100"
            onClick={() => setShowLogin(true)}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
          </button>
        </div>
      </div>

      {showRegister && (
        <div className="modal-backdrop fade show">
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content dark-card">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-person-plus-fill me-2"></i>Creación de cuenta
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowRegister(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleRegister} className="row g-3 needs-validation">
                    <div className="col-md-6">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control dark-input" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Apellido</label>
                      <input type="text" className="form-control dark-input" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">RUT</label>
                      <input type="text" className="form-control dark-input" placeholder="123456789" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Correo electrónico</label>
                      <input type="email" className="form-control dark-input" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Región</label>
                      <select className="form-select dark-input" required>
                        <option disabled selected>Selecciona Región</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Comuna</label>
                      <select className="form-select dark-input" required>
                        <option disabled selected>Selecciona Comuna</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input type="tel" className="form-control dark-input" placeholder="Ej: 987654321" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contraseña</label>
                      <input type="password" className="form-control dark-input" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fecha de nacimiento</label>
                      <input type="date" className="form-control dark-input" required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-accent w-100">
                        <i className="bi bi-check-circle-fill me-2"></i>Registrarme
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-backdrop fade show">
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content dark-card">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Inicio de sesión
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowLogin(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleLogin}>
                    <input type="email" className="form-control dark-input mb-3" placeholder="Correo electrónico" required />
                    <input type="password" className="form-control dark-input mb-3" placeholder="Contraseña" required />
                    <button type="submit" className="btn btn-accent w-100">
                      <i className="bi bi-door-open-fill me-2"></i>Entrar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Auth