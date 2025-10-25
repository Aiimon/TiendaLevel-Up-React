import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const claveSecreta = "miClaveFijaParaAES";

export default function RegistroForm({ cerrarModal }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fecha, setFecha] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("/data/regiones.json")
      .then(res => res.json())
      .then(data => setRegiones(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const regionObj = regiones.find(r => r.region === region);
    setComunas(regionObj ? regionObj.comunas : []);
    setComuna("");
  }, [region, regiones]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!/^[0-9]{8}[0-9Kk]$/.test(rut)) {
      setMensaje("RUT inválido");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMensaje("Email inválido");
      return;
    }
    if (new Date().getFullYear() - new Date(fecha).getFullYear() < 18) {
      setMensaje("Debes ser mayor de 18 años");
      return;
    }

    // Guardar usuario
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.some(u => u.email === email)) {
      setMensaje("Correo ya registrado");
      return;
    }

    const nuevoUsuario = {
      nombre,
      apellido,
      rut: CryptoJS.AES.encrypt(rut, claveSecreta).toString(),
      email,
      password: CryptoJS.AES.encrypt(password, claveSecreta).toString(),
      fecha,
      region,
      comuna,
      rol: "usuario"
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    setMensaje("Registro exitoso");
    cerrarModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre" required/>
      <input type="text" value={apellido} onChange={e=>setApellido(e.target.value)} placeholder="Apellido" required/>
      <input type="text" value={rut} onChange={e=>setRut(e.target.value)} placeholder="RUT" required/>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo" required/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" required/>
      <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required/>

      <select value={region} onChange={e=>setRegion(e.target.value)} required>
        <option value="">Selecciona Región</option>
        {regiones.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
      </select>

      <select value={comuna} onChange={e=>setComuna(e.target.value)} required>
        <option value="">Selecciona Comuna</option>
        {comunas.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <button type="submit">Registrarme</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
