import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom"; 
import usuariosData from "../data/usuarios.json";

const claveSecreta = "miClaveFijaParaAES";

export default function LoginForm({ onClose, onUsuarioChange }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Traer usuarios de localStorage
    let usuariosLS = JSON.parse(localStorage.getItem("usuarios"));

    // Si no existen o están vacíos, cargamos desde JSON
    if (!usuariosLS || usuariosLS.length === 0) {
      const usuariosEncriptados = usuariosData.map(u => ({
        ...u,
        rut: CryptoJS.AES.encrypt(u.rut, claveSecreta).toString(),
        password: CryptoJS.AES.encrypt(u.password, claveSecreta).toString()
      }));
      localStorage.setItem("usuarios", JSON.stringify(usuariosEncriptados));
      usuariosLS = usuariosEncriptados;
    }
  }, []);

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ tipo, mensaje });
    setTimeout(() => setAlerta(null), 4000);
  };

  // --- Validación en tiempo real ---
  const handleChange = (campo, valor) => {
    let mensajeError = "";

    if (campo === "email") {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(valor)) mensajeError = "Correo inválido";
      setEmail(valor);
    }

    if (campo === "password") {
      if (valor.length < 6) mensajeError = "La contraseña debe tener al menos 6 caracteres";
      setPassword(valor);
    }

    setErrores(prev => ({ ...prev, [campo]: mensajeError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || errores.email || errores.password) {
      mostrarAlerta("danger", "Por favor, ingresa un correo valido.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.email === email.trim());

    if (!usuario) {
      mostrarAlerta("danger", "Este correo no está registrado.");
      return;
    }

    try {
      const bytesPass = CryptoJS.AES.decrypt(usuario.password, claveSecreta);
      const passwordDec = bytesPass.toString(CryptoJS.enc.Utf8);

      if (passwordDec !== password) {
        mostrarAlerta("danger", "Contraseña incorrecta.");
        return;
      }

      const bytesRut = CryptoJS.AES.decrypt(usuario.rut, claveSecreta);
      const rutDec = bytesRut.toString(CryptoJS.enc.Utf8);

      const usuarioSesion = { ...usuario, rut: rutDec };
      localStorage.setItem("usuario", JSON.stringify(usuarioSesion));

      mostrarAlerta("success", `Bienvenido, ${usuario.nombre}`);

      if (onUsuarioChange) onUsuarioChange();

      setTimeout(() => {
        onClose();

        // 🔹 Redirigir según rol
        if (usuarioSesion.rol === "admin") {
          navigate("/homeadmin");
        } else {
          navigate("/"); // usuario normal
        }
      }, 1000);

    } catch {
      mostrarAlerta("danger", "Correo o contraseña incorrectos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      {alerta && (
        <div className={`alert alert-${alerta.tipo} w-100`} role="alert">
          {alerta.mensaje}
        </div>
      )}

      <div className="col-12">
        <input
          type="email"
          className={`form-control ${errores.email ? "is-invalid" : email ? "is-valid" : ""}`}
          placeholder="Correo electrónico"
          value={email}
          onChange={e => handleChange("email", e.target.value)}
        />
        {errores.email && <div className="text-danger mt-1">{errores.email}</div>}
      </div>

      <div className="col-12">
        <input
          type="password"
          className={`form-control ${errores.password ? "is-invalid" : password ? "is-valid" : ""}`}
          placeholder="Contraseña"
          value={password}
          onChange={e => handleChange("password", e.target.value)}
        />
        {errores.password && <div className="text-danger mt-1">{errores.password}</div>}
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-accent w-100">
          <i className="bi bi-door-open-fill me-2"></i>Entrar
        </button>
      </div>
    </form>
  );
}
