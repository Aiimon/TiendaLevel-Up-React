import { useState } from "react";
import CryptoJS from "crypto-js";

const claveSecreta = "miClaveFijaParaAES";

export default function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      alert("Correo o contraseña incorrectos.");
      return;
    }

    try {
      const bytesPass = CryptoJS.AES.decrypt(usuario.password, claveSecreta);
      const passwordDec = bytesPass.toString(CryptoJS.enc.Utf8);

      if (passwordDec === password) {
        const bytesRut = CryptoJS.AES.decrypt(usuario.rut, claveSecreta);
        const rutDec = bytesRut.toString(CryptoJS.enc.Utf8);

        const usuarioSesion = { ...usuario, rut: rutDec };
        localStorage.setItem("usuario", JSON.stringify(usuarioSesion));

        alert(`Bienvenido, ${usuario.nombre}`);
        onClose(); // cierra el modal
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    } catch {
      alert("Correo o contraseña incorrectos.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control dark-input mb-3"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="form-control dark-input mb-3"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-accent w-100">
        <i className="bi bi-door-open-fill me-2"></i>Entrar
      </button>
    </form>
  );
}