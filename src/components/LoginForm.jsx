import { useState } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const claveSecreta = "miClaveFijaParaAES";

export default function LoginForm({ cerrarModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      setMensaje("Correo o contraseña incorrectos");
      return;
    }

    const bytesPass = CryptoJS.AES.decrypt(usuario.password, claveSecreta);
    const passDec = bytesPass.toString(CryptoJS.enc.Utf8);

    if (passDec !== password) {
      setMensaje("Correo o contraseña incorrectos");
      return;
    }

    const bytesRut = CryptoJS.AES.decrypt(usuario.rut, claveSecreta);
    const rutDec = bytesRut.toString(CryptoJS.enc.Utf8);

    const usuarioSesion = { ...usuario, rut: rutDec };
    localStorage.setItem("usuario", JSON.stringify(usuarioSesion));
    setMensaje(`Bienvenido, ${usuario.nombre}`);
    cerrarModal();

    if (usuario.rol === "admin") navigate("/homeadmin");
    else navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo" required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
