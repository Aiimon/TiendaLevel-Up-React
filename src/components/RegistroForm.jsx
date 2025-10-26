
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const claveSecreta = "miClaveFijaParaAES";

export default function RegistroForm({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fecha, setFecha] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [regionesData, setRegionesData] = useState([]);

  useEffect(() => {
    fetch("../data/regiones.json")
      .then(res => res.json())
      .then(data => setRegionesData(data))
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.email === email)) {
      alert("Este correo ya está registrado.");
      return;
    }

    const rutEncriptado = CryptoJS.AES.encrypt(rut, claveSecreta).toString();
    const passwordEncriptada = CryptoJS.AES.encrypt(password, claveSecreta).toString();

    const nuevoUsuario = { nombre, apellido, rut: rutEncriptado, email, password: passwordEncriptada, fecha, region, comuna, telefono, rol: "usuario" };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Registro exitoso");
    onClose(); // Cierra el modal
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 needs-validation">
      <div className="col-md-6">
        <label className="form-label">Nombre</label>
        <input type="text" className="form-control dark-input" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Apellido</label>
        <input type="text" className="form-control dark-input" value={apellido} onChange={e => setApellido(e.target.value)} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">RUT</label>
        <input type="text" className="form-control dark-input" value={rut} onChange={e => setRut(e.target.value)} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Correo electrónico</label>
        <input type="email" className="form-control dark-input" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      {/* Región y Comuna */}
      <div className="col-md-6">
        <label className="form-label">Región</label>
        <select className="form-select dark-input" value={region} onChange={e => setRegion(e.target.value)} required>
          <option disabled value="">Selecciona Región</option>
          {regionesData.map(r => <option key={r.region}>{r.region}</option>)}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Comuna</label>
        <select className="form-select dark-input" value={comuna} onChange={e => setComuna(e.target.value)} required>
          <option disabled value="">Selecciona Comuna</option>
          {region && regionesData.find(r => r.region === region)?.comunas.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Teléfono</label>
        <input type="tel" className="form-control dark-input" value={telefono} onChange={e => setTelefono(e.target.value)} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Contraseña</label>
        <input type="password" className="form-control dark-input" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Fecha de nacimiento</label>
        <input type="date" className="form-control dark-input" value={fecha} onChange={e => setFecha(e.target.value)} required />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-accent w-100">Registrarme</button>
      </div>
    </form>
  );
}
